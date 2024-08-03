const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");

export const getClipboardText = () => Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor);
const PacketBuffer = net.minecraft.network.PacketBuffer;
const C17PacketCustomPayload = net.minecraft.network.play.client.C17PacketCustomPayload;
const Unpooled = Java.type('io.netty.buffer.Unpooled');
const MCNBTTagList = net.minecraft.nbt.NBTTagList;
const MCNBTTagCompound = net.minecraft.nbt.NBTTagCompound;
const MCNBTTagString = net.minecraft.nbt.NBTTagString;

register('command', ...args => {
  let clipboard = args?.join(' ') || getClipboardText();
  if (!clipboard) return ChatLib.chat('&4> invalid clipboard text.')
  let stack = Player.getHeldItem().itemStack; 

  if (Player.getHeldItem().getRegistryName() !== 'minecraft:writable_book') return ChatLib.chat('&4> not holding book.');

  
  let bookPages = new MCNBTTagList();
  
  for (let i = 0; i < 50; i++) bookPages.func_74742_a(new MCNBTTagString(clipboard));
  // hasTagCompound
  if (stack.func_77942_o())  {
    // getTagCompound setTag
    stack.func_77978_p().func_74782_a("pages", bookPages);
  } else {
    let tag = new MCNBTTagCompound();
    tag.func_74782_a("pages", bookPages);
    // setTagCompound
    stack.func_77982_d(tag)
  }

  let packet_buffer = new PacketBuffer(Unpooled.buffer());   
  // writeStackToBuffer
  packet_buffer.func_150788_a(stack);
  // getNetHandler addToSendQueue
  Client.getMinecraft().func_147114_u().func_147297_a(new C17PacketCustomPayload("MC|BEdit", packet_buffer));

  ChatLib.chat(`&a> printed text onto book.`);
}).setName('wbook');
