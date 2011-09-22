    var fs   = require('fs');
    var path = require('path');
    var util = require('util');

    exports.removeDirectory = function(sPath, fCallback) {
        fCallback = typeof fCallback == 'function' ? fCallback  : function() {};

        exec('rm ' + path.join(sPath, '/*'), function() {
            fs.rmdir(sPath, function() {
                fCallback(sPath);
            });
        });
    };

    exports.copyDirectoryPropertiesToFile = function(sFile, fCallback) {
        fCallback = typeof fCallback == 'function' ? fCallback  : function() {};

        var sPath = path.dirname(sFile);
        fs.stat(sPath, function(oError, oStat) {
            fs.chmod(sFile, oStat.mode, function() {                                        // Copy Permissions from Parent Directory
                fs.chown(sFile, oStat.gid, oStat.uid, function() {                          // Copy Ownership from Parent Directory
                    fCallback(sFile);
                });
            });
        });
    };

    exports.copyFile = function(sFromFile, sToFile, fCallback) {
        fCallback = typeof fCallback == 'function' ? fCallback  : function() {};

        util.pump(fs.createReadStream(sFromFile), fs.createWriteStream(sToFile), function() { // CANNOT use fs.rename due to partition limitations
            exports.copyDirectoryPropertiesToFile(sToFile, function() {
                fCallback(sFile);
            });
        });
    };

    exports.moveFile = function(sFromFile, sToFile, fCallback) {
        fCallback = typeof fCallback == 'function' ? fCallback  : function() {};

        exports.copyFile(sFromFile, sToFile, function() {
            fs.unlink(sFromFile, function() {
                fCallback(sToFile);
            });
        });
    };


