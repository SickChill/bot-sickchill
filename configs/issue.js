var _ = require('lodash');

module.exports = {
    getNumber: function(data) {
        return data.issue.number;
    },
    before: 'Thanks for the bug report! Please make sure you add all the information we require to investigate your issue. Be aware that we cant look into issues if there isn\'t enough information, and might close them as a result. More info can be found [here](https://github.com/SickRage/sickrage-issues/blob/master/README.md)',
    after: ' For FEATURE REQUESTS use [Feathub](http://feathub.com/SickRage/SickRage)  \n\n' +
            '  #### What info do we require? : \n\n' +
            '- Branch \n\n' +
            '- Commit hash \n\n' +
            '- Your operating system & python version \n\n' +
            '- Device (Synology, QNAP, PC etc.)  \n\n' +
            '- What you did  \n\n' +
            '- What happened \n\n' +
            '- What are the steps to reproduce your issue? \n\n' +
            '- Include a link with your **FULL** [log file](https://github.com/SiCKRAGE/sickrage-issues/wiki/FAQ\'s-and-Fixes#enable-debug-for-logs) that has the error. Please use [GIST](http://gist.github.com) or [Pastebin](http://pastebin.com/)  \n\n' +
            '- Use a proper title. (The title should clearly describe your issue.)   \n\n' +
            '- #### Many issues can simply be solved by: \n\n' +
            '- Making sure you update & run to the latest version. \n\n' +
            '- Have you tried turning your device off and on again? \n\n' +
            '- Using the **search** function to see if this issue has already been reported/solved. \n\n' +
            '- Do a [GIT reset](https://github.com/SiCKRAGE/sickrage-issues/wiki/FAQ\'s-and-Fixes#update-problems-try-this) - Checking the [ [Wiki] ](https://github.com/SiCKRAGE/sickrage-issues/wiki) for [ [Guides] ](https://github.com/SiCKRAGE/sickrage-issues/wiki/Installation-&-Configuration-Guides) [ [FAQS] ](https://github.com/SiCKRAGE/sickrage-issues/wiki/FAQ%27s-and-Fixes) [ [Main settings] ](https://github.com/SiCKRAGE/sickrage-issues/wiki/Settings-explained) [ [Show settings] ](https://github.com/SiCKRAGE/sickrage-issues/wiki/Show-settings-explained) [ [Remaining settings] ](https://github.com/SiCKRAGE/sickrage-issues/wiki/Remaining-settings-explained) \n\n' +
            '- If SickRage doesnt find any episodes you probably need to :   \n\n' +
            '   - Add a [Scene Exception](https://github.com/SiCKRAGE/sickrage-issues/wiki/Scene-exceptions-and-numbering) \n\n' +
            '   - Make sure you understand how [quality detection](https://github.com/SiCKRAGE/sickrage-issues/wiki/Quality-Settings#quality-detectiondetermination) works during searches. \n\n' +
            '   - Shutdown SickRage and remove the `cache.db` file \n\n' +
            '- If you use a QNAP and have SSL errors try this [package](https://www.dropbox.com/s/j1svazqdi9ieq82/SickBeard-TVRage_151227.qpkg) & [info](http://forum.qnap.com/viewtopic.php?f=223&t=118366). \n\n' +
            '- If you have a \'ascii codec can\'t encode character\' error, than set your Locale to [UTF-8](https://github.com/SiCKRAGE/sickrage-issues/wiki/FAQ%27s-and-Fixes#i-have-problems-with-special-characters-%C3%A9-etc-what-can-i-do) \n\n' +
            '\n\nThanks!',
    checks: [
        // Basic info
        {
            message: 'Include basic information: Branch/Commit, OS, What you did, What happened, What you expected',
            condition: function (data) {
                return 0;
            }
        },
        // Enable debugging
        {
                message: 'Enable debug logging (be sure to disable after the bug is fixed)',
                condition: function (data) {
                        var inline_logs = isInlineLog(data.issue.body);
                        if(inline_logs)
                                return _.contains(data.issue.body, 'DEBUG [');
                        return 0;
                }
        },
        // Post logs
        {
            message: 'Post debug logs, either inline (for smaller logs) or using gist)',
            condition: function (data) {

                var inline_logs = isInlineLog(data.issue.body);

                var linked_logs = 0;
                _.each(['pastebin.com', 'gist.github.com'], function(check_for) {
                    linked_logs += _.contains(data.issue.body.toLowerCase(), check_for) ? 1 : 0;
                });

                return inline_logs || linked_logs;
            }
        },
        // Wrap inline logs inside ```
        {
            message: 'Please wrap inline logs inside \\`\\`\\` and \\`\\`\\` for readability',
            condition: function (data) {
                var inline_logs = isInlineLog(data.issue.body);

                if(inline_logs)
                    return _.contains(data.issue.body, '```');
            }
        }
    ]
};

function isInlineLog(data) {
    var reg = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\s+(DEBUG|WARNING|INFO|DB|ERROR)\s+[\w-]+\s+::\s+|AA  File/g;
    return data.match(reg) ? true : false;
}
