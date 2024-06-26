module.exports.config = {
	name: 'listbox',
	version: '1.0.0',
	credits: 'manhIT',
	role: 2,
	alliases: ['listbox'],
   cooldown: 0,
   hasPrefix: false,
	   usage: "",
   
   };
   
   module.exports.handleReply = async function({ api, event, args, Threads, handleReply }) {
   
	if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
   
	var arg = event.body.split(" ");
	var idgr = handleReply.groupid[arg[1] - 1];
   
   
	switch (handleReply.type) {
   
	   case "reply":
		{
		   if (arg[0] == "ban" || arg[0] == "Ban") {
			const data = (await Threads.getData(idgr)).data || {};
			data.banned = 1;
			await Threads.setData(idgr, { data });
			global.data.threadBanned.set(parseInt(idgr), 1);
			api.sendMessage(`[${idgr}] It was successful!`, event.threadID, event.messageID);
			break;
		   }
   
		   if (arg[0] == "out" || arg[0] == "Out") {
			api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
			api.sendMessage("Out thread with id: " + idgr + "\n" + (await Threads.getData(idgr)).name, event.threadID, event.messageID);
			break;
		   }
   
		}
