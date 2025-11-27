import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema ({
// title: {type: String, required: true},
text: {type: String, required: true},
owner: {type: mongoose.Schema.Types.ObjectId, ref : 'User'}
}, 
{timestamps:true}
)

const dinnerSchema = new mongoose.Schema ({
    host: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    theme: {type: String, required: true},
    starter: {type: String},
    main: {type: String},
    dessert: {type: String},
    drink: {type: String},
    date: {type: Date},
    comments: [commentSchema],
    guests: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
    isCompleted: {type: Boolean}
}, 
{timestamps: true}
)

const Dinner= mongoose.model('Dinners', dinnerSchema)
export default Dinner