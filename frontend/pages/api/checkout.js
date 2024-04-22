import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // Ensure database connection
    await mongooseConnect();

    // Extract required data from request body
    const { name, email, city, postalCode, streetAddress, country, cartProducts } = req.body;

    // Fetch products from cartProducts (assuming it contains product IDs)
    const products = await fetchProducts(cartProducts);

    // Create line items for the Stripe session
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'INR',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100, // Price in cents
      },
      quantity: cartProducts.filter(id => id === product._id).length,
    }));

    if (lineItems.length === 0) {
      throw new Error('No line items found');
    }

    // Create order in the database
    const order = await Order.create({
      line_items: lineItems,
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      paid: false,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.PUBLIC_URL}/cart?success=1`,
      cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`,
      metadata: { orderId: order._id.toString() },
    });

    // Send the session URL as a response
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error.message);
    res.status(500).json({ error: 'An error occurred while creating the Stripe session' });
  }
}

async function fetchProducts(productIds) {
  // You need to implement this function to fetch product details based on productIds
  // This function should return an array of products
}
