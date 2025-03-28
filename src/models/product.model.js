import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("products", productSchema);

export default productModel;

// {
//     "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
//     "title": "Laptop Gamer Pro",
//     "description": "Laptop de alto rendimiento para gaming.",
//     "code": "LP123",
//     "price": 1500,
//     "status": true,
//     "stock": 10,
//     "category": "Electrónica",
//     "thumbnails": ["images/laptop1.jpg", "images/laptop2.jpg"]
// }
