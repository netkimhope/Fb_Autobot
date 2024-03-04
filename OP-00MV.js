module.exports.config = {
    name: "mv-all",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "kennethpanio",
    description: "move members to main gc",
    usePrefix: true,
    commandCategory: "OPERATOR",
    usages: '[threadID]',
    cooldowns: 5
};

let defaultTargetThreadID = "6843550052392742"; // Set your default target thread ID here

module.exports.run = async function ({ api, event, args }) {
    const { threadID: sourceThreadID } = event;

    // Check if the user provided a custom targetThreadID as an argument
    const targetThreadID = args[0] || defaultTargetThreadID;

    try {
        const { participantIDs } = await api.getThreadInfo(sourceThreadID);

        if (participantIDs.length === 0) {
            return api.sendMessage("No members in the current group.", sourceThreadID);
        }

        let index = 0;
        let successCount = 0;

        const addMember = async () => {
            if (index < participantIDs.length) {
                const memberID = participantIDs[index];

                try {
                    const isMemberInGroup = await api.getThreadInfo(targetThreadID, null, true);
                    const isAlreadyMember = isMemberInGroup.participantIDs.includes(memberID);

                    if (!isAlreadyMember) {
                        await api.addUserToGroup(memberID, targetThreadID);
                        successCount++;
                    }
                } catch (error) {
                    console.error(`Failed to add user ${memberID} to group ${targetThreadID}. Error: ${error}`);
                }

                index++;
                setTimeout(addMember, 5000); // Add the next member after 5 seconds
            } else {
                api.sendMessage(`Added ${successCount} members to the target group.`, sourceThreadID);
            }
        };

        addMember(); // Start the process
    } catch (e) {
        console.error(`Error: ${e.name} - ${e.message}`);
        return api.sendMessage(`An error occurred: ${e.message}`, sourceThreadID);
    }
};
