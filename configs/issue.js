var _ = require('lodash');

module.exports = {
    getNumber: function(data) {
        return data.issue.number;
    },
    before: 'Thanks for the issue report! Before a real human comes by, please make sure your report has all the below criteria checked',
    after: 'Please make sure you also read [how to create an issue](https://github.com/SickRage/sickrage-issues/blob/master/README.md) and followed all of the steps. \n\n' +
        'The title should describe your issue. Having "SR not working" or "I get this bug" for 100 issues, isn\'t really helpful. We will close issues if there isn\'t enough information.\n\n' +
        'Sometimes the devs may seem like grunts and respond with short answers. This isn\'t (always) because the dev hates you, but because he\'s on mobile or busy fixing bugs. If something isn\'t clear, please let us know, and this bot may get updated to automatically answer you.' +
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
            message: 'Post debug logs, either inline (for smaller logs) or using gist',
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
