const { zokou } = require('../framework/zokou');
const { attribuerUnevaleur } = require('../bdd/welcome');

// Generic toggle command for group events (welcome, goodbye, etc.)
async function events(commandName) {
    zokou({
        nomCom: commandName,
        categorie: 'Group',
    }, async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser, verifAdmin } = commandeOptions;

        // Check if user is admin or superuser
        if (verifAdmin || superUser) {
            if (!arg[0] || arg.join(' ').trim() === '') {
                repondre(`Use: *${commandName} on* to enable or *${commandName} off* to disable.`);
            } else {
                const action = arg[0].toLowerCase();
                if (action === 'on' || action === 'off') {
                    await attribuerUnevaleur(dest, commandName, action);
                    repondre(`✅ *${commandName}* has been set to *${action}*.`);
                } else {
                    repondre(`Invalid option. Use *on* to enable or *off* to disable.`);
                }
            }
        } else {
            repondre(`🚫 You are not authorized to use this command.`);
        }
    });
}

// Register commands for various group events
events('welcome');
events('goodbye');
events('antipromote');
events('antidemote');
