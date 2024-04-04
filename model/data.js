
const commentSchema = new mongoose.Schema({
    comimg: { type: String },
    comname: { type: String },
    com: { type: String },
    likes: {type: [String]},
    dislikes: {type: [String]},
    urlname: { type: String},
    notdeleted: { type: Boolean },
    isedited:{ type: Boolean },
});

const reviewSchema = new mongoose.Schema({
    revimg: { type: String },
    revname: { type: String },
    revrating: { type: String},
    revtitle: { type: String},
    hasimg: { type: Boolean},
    revimgpost: { type: String},
    hasvid:{ type: Boolean},
    revvid: { type: String},
    rev: { type: String },
    hascomments: { type: Boolean },
    likes: {type: [String]},
    dislikes: {type: [String]},
    comments: [commentSchema],
    urlname: { type: String},
    notdeleted: { type: Boolean },
    isedited:{ type: Boolean },
});

const restoSchema = new mongoose.Schema({
    name: { type: String },
    linkname: { type: String},
    user: { type: String },
    pass: { type: String },
    image: { type: String },
    imagesquare: {type: String},
    description: { type: String },
    landmark: { type: String },
    rating: { type: Number },
    category: { type: String },
    price: { type: Number },
    maplink: { type: String },
    revdata: [reviewSchema],
    reportdata:  [{ type: String }]
},{ versionKey: false });

const userSchema = new mongoose.Schema({
    name: { type: String },
    urlname: { type: String },
    user: { type: String },
    pass: { type: String },
    image: { type: String },
    description: {type: String},
    revdata: [reviewSchema],
    reportdata:  [{ type: String }]
},{ versionKey: false });

const restoModel = mongoose.model('restaurants', restoSchema);
const userModel = mongoose.model('users', userSchema);

let appdata = {
    'restoModel'   : restoModel,
    'userModel'   : userModel
};

module.exports.appdata = appdata;
