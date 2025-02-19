require "spec_helper"

describe Sequences::Publish do
  body = [
    {
      kind: "send_message",
      args: { message: "has desc.", message_type: "warn" },
      body: [
        { kind: "channel", args: { channel_name: "toast" } },
      ],
    },
  ]

  let(:user) { FactoryBot.create(:user) }
  let(:device) { user.device }
  let(:other_device) { FactoryBot.create(:user).device }
  let(:sequence) { FakeSequence.with_parameters(device: device, body: body) }

  it "allows override by admins" do
    json = Sequences::Create.run!(
      name: "first party sequence",
      kind: "sequence",
      args: {
        version: 20180209,
        loals: {
          kind: "scope_declaration",
          args: {},
          body: [
            {
              kind: "parameter_declaration",
              args: {
                label: "parent",
                default_value: { kind: "coordinate", args: { x: 0, y: 0, z: 0 } },
              },
            },
          ],
        },
      },
      body: [{ kind: "lua", args: { lua: "print(\"Hello, world!\")" } }],
      device: device,
    )
    s = Sequence.find(json[:id])
    d = s.device
    result = Sequences::PublishUnsafe.run!(sequence: s, device: d)
    expect(result.author_device_id).to eq(d.id)
    Fragments::Show.run!(owner: result.sequence_versions.first)
  end

  it "disallows denied nodes and args" do
    bad = FakeSequence.with_parameters(device: device, body: [
                                         {
                                           kind: "lua",
                                           args: {
                                             lua: "os.cmd('cat /etc/password')",
                                           },
                                         },
                                       ])
    problems = Sequences::Publish.run(sequence: bad, device: device)
    expected = "For security reasons, we can't publish sequences " \
               "that contain the following content: lua"
    actual = problems.errors["sequence"].message
    expect(actual).to eq(expected)
  end

  it "re-publishes changes" do
    # ==== Create a sequence.
    expect(sequence.device_id).to eq(device.id)
    d1 = "descr. 1"
    # ==== Publish it.
    pub1 = Sequences::Publish.run!(sequence: sequence,
                                   device: device,
                                   description: d1)
    expect(pub1.sequence_versions.count).to eq(1)
    current_version = pub1.sequence_versions.first
    expect(pub1.cached_author_email).to eq(user.email)
    expect(current_version.description).to eq(d1)
    # ==== Update it.
    body2 = [
      {
        kind: "send_message",
        args: { message: "Updated", message_type: "warn" },
        body: [
          { kind: "channel", args: { channel_name: "toast" } },
        ],
      },
    ]
    json = Sequences::Update.run!(sequence: sequence,
                                  name: "My Sequence",
                                  device: device,
                                  body: body2)
    sequence2 = Sequence.find(json["id"])
    # ==== Re-Publish it.
    d2 = "descr. 2"
    pub2 = Sequences::Publish.run!(sequence: sequence2,
                                   device: device,
                                   description: d2)
    expect(pub2.sequence_versions.count).to eq(2)
    current_version = pub2.sequence_versions.last
    expect(pub2.cached_author_email).to eq(user.email)
    expect(current_version.description).to eq(d2)
  end

  it "publishes a sequence with option description field" do
    expect(sequence.device_id).to eq(device.id)
    description = "This is a description"
    publication = Sequences::Publish.run!(sequence: sequence,
                                          device: device,
                                          description: description)
    expect(publication.sequence_versions.count).to eq(1)
    current_version = publication.sequence_versions.first
    expect(publication.cached_author_email).to eq(user.email)
    expect(current_version.description).to eq(description)
  end

  it "disallows publishing other people's stuff" do
    expect do
      Sequences::Publish.run!(sequence: FakeSequence.with_parameters(device: other_device),
                              device: device)
    end.to raise_error(Errors::Forbidden)
  end

  it "publishes an empty sequence" do
    sequence = FakeSequence.with_parameters(device: device)
    expect(sequence.device_id).to eq(device.id)
    sp = Sequences::Publish.run!(sequence: sequence, device: device)
    expect(sp.published).to be(true)
  end
end
