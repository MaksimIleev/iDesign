var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
  list : {
  type: [String],
  required: false
}
});

var serviceSchema = new Schema({
    mainImgSrc:  {
        type: String,
        required: true
    },
    serviceHeader : {
      type: String,
      required: true
    },
    serviceHeaderContent : {
      type: String,
      required: true
    },
    serviceSubHeader: {
      type: String,
      required: false
    },
    serviceSubList: {
      type: [String],
      required: false
    }
}, {
    timestamps: true
});



var ServicesModel = mongoose.model('ServiceModel', serviceSchema, 'idesign');
module.exports = ServicesModel;
