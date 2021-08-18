import mongoose from 'mongoose';

const tasks_typesSchema = mongoose.Schema({
    main_product: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    sub_product: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date, default: Date.now()
    }
})

var tasks_types = mongoose.model('tasks_types', tasks_typesSchema);

export default tasks_types;
