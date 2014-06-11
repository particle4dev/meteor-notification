Package.describe({
    summary: "Simple notification using blaze engine."
});

// meteor test-packages ./
var both = ['client', 'server'];
var client = ['client'];
var server = ['server'];

Package.on_use(function (api) {
    api.use('underscore', client);
    api.use('templating', client);
    api.add_files([
        'src/export.js',
        'src/auto-increment.js',
        'src/pipeline.js',
        'src/message.html',
        'src/message.js',
        'src/notification.js'
    ], client);
    if (typeof api.export !== 'undefined') {
        api.export('NotificationDOM', client);
    }
});

Package.on_test(function (api) {
    api.use(['test-helpers', 'tinytest'], client);

    api.add_files([
    ], client);
});