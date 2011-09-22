    var fs   = require('fs');
    var path = require('path');
    var util = require('util');

    exports.copyFile = function(sFromFile, sToFile, fCallback) {
        fCallback = typeof fCallback == 'function' ? fCallback  : function() {};

        var sDesitinationPath = path.dirname(sToFile);
        fs.stat(sDesitinationPath, function(oError, oStat) {
            util.pump(fs.createReadStream(sFromFile), fs.createWriteStream(sToFile), function() { // CANNOT use fs.rename due to partition limitations
                fs.chmod(sToFile, oStat.mode, function() {                                        // Copy Permissions from Parent Directory
                    fs.chown(sToFile, oStat.gid, oStat.uid, function() {                          // Copy Ownership from Parent Directory
                        fCallback(sToFile);
                    });
                });
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


