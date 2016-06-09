require('dotenv').load();

var util = require('util'),
    fs = require('fs'),
    async = require('async'),
    nodeSES = require('node-ses'),
    piwik = require('piwik'),
    moment = require('moment'),
    keystone = require('keystone'),
    Enquiry;

function processSyncData(fn, callback) {
  var piwikClient = piwik.setup(process.env.PIWIK_URI, process.env.PIWIK_TOKEN);

  fs.readFile(fn, {encoding: 'utf8'}, function(err, content) {
    if (err) return callback(err);

    var data = JSON.parse(content),
        settings = {},
        enquiries = [];

    async.eachSeries(data, function(recordStr, next) {
      var record, recordType;

      try {
        record = JSON.parse(recordStr);
        recordType = record.type;
      } catch(err) {
        if (err instanceof SyntaxError) {
          console.log("Error parsing record: %s:\n%j", err.message, recordStr);
          return next();
        }
        return next(err);
      }

      switch (recordType) {
        case "settings":
          console.log('%s: %j', recordType, record);
          settings = record.formData;
          next();
          break;
        case "stats":
          console.log('%s: %j', recordType, record);
          piwikClient.track({
            idsite: process.env.PIWIK_SITEID,
            url: process.env.PDOMAIN + record.path,
            cdt: moment(record._id).format('YYYY-MM-DD HH:mm:ss'),
            _cvar: { '1': ['Platform', record.device] }
          }, function(err) {
            if (err) {
              console.error("Error saving %s: %s\n%j", recordType, err, record);
            }
            next();
          });
          break;
        case "enquiry":
          console.dir(record);
          var newEnquiry = new Enquiry.model(record.formData);

          newEnquiry.save(function(err) {
            if (err) {
              console.error("Error saving %s: %s\n%j", recordType, err, record);
            } else {
              enquiries.push(newEnquiry);
            }
            next();
          });
          break;
        default:
          console.warn("Unknown record type: %s\n%j", recordType, record);
          next();
      }
    }, function(err) {
      if (err) return callback(err);

      if (!enquiries.length) { // don't send email if there aren't any enquiries
        return callback();
      }

      var enquiriesCSVfn = "/uploads/enquiries-" + (new Date()).getTime() + ".csv",
          enquiriesCSV = enquiries.map(function(e) { return e.toCSV(); });

      enquiriesCSV = Enquiry.CSV_HEADER + "\n" + enquiriesCSV.join("\n");

      fs.writeFile("public"+enquiriesCSVfn, enquiriesCSV, function(err) {
        if (err) {
          console.error("Error writing file %s: %s", err);
          return callback(err);
        }

        var enquiriesCSVuri = process.env.PDOMAIN + enquiriesCSVfn;

        nodeSES.createClient({
          key: process.env.SES_KEY,  secret: process.env.SES_SECRET
        }).sendemail({
          to: process.env.SES_DISTRO_LIST.split(','),
          from: process.env.SES_SENDER,
          cc: process.env.SES_CC.split(','),
          subject: util.format('[%s] %s', settings.showname, "Lead Information"),
          message: util.format('Lead information:<br /><br /><a href="%s" />%s</a>',
            enquiriesCSVuri, enquiriesCSVuri),
          altText: util.format("Lead information:.\n\n%s", enquiriesCSVuri)
        }, function (err) {
          if (err) {
            console.error("Error sending lead information: %s", err);
          }
          callback(err);
        });
      });
    });
  });
}

setTimeout(function() {
  // var argv = require('minimist')(process.argv.slice(2));

  Enquiry = keystone.list('Enquiry');

  // async.eachSeries(argv._, function(fn, next) {
  async.eachSeries(process.argv.slice(2), function(fn, next) {
    console.log(fn);
    processSyncData(fn, next);
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
}, 5000);

require('./setup')(keystone, function() {});
