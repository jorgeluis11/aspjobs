var mongoose = require('mongoose'), 
    uuid = require('node-uuid');

var Schema = mongoose.Schema;

var verificationTokenSchema = new mongoose.Schema({
   _subscription : { type: mongoose.Schema.Types.ObjectId, ref: 'subscriptionSchema' },
   token: {type: String, required: true},
   created_at: {type: Date, required: true, default: Date.now, expires: '4h'}
});

verificationTokenSchema.methods = {
   createVerificationToken(done) {
      return uuid.v4();
      // var verificationToken = this;
      // verificationToken.set('token', token);
      // verificationToken.save( function (err) {
      //    if (err) return done(err);
      //       return done(null, token);
      // });
   },
   verifyUser(token, done) {
    this.findOne({token: token}, function (err, sub){
        if (err) return done(err);
        sub.set('token',"");
        sub.set("active");
        console.log("send Email");
        });
    }
};

module.exports = mongoose.model('Token', verificationTokenSchema);