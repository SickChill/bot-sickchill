module.exports = {

    getNumber: function(data) {
        return data.pull_request.number;
    },
    before: 'Thanks for the pull request! Before a real human comes by, please make sure your PR has all of the below criteria checked',
    after: 'Please make sure you also read [contribution guide](https://github.com/SickRage/SickRage/blob/master/contributing.md) and followed all of the steps.' +
        '\n\nThanks!',
    checks: [
        // Fill in the dots
        {
            message: 'Give a description on what the PR is for.',
            condition: function (data) {
                return data.pull_request.body.length > 20;
            }
        },
        // Send a PR to the develop branch
        {
            message: 'Make sure your PR is based on the DEVELOP branch',
            condition: function (data) {
                return data.pull_request.base.ref == 'develop';
            }
        },
        // Split up big commits
        {
            message: 'Don\'t send big changes all at once. Split up big PRs into multiple smaller PRs that are easier to manage and review',
            condition: function (data) {
                return data.pull_request.commits < 20;
            }
        }
    ]
};
