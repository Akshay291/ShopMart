import React from 'react';

const OrderSuccessful = () => {
    const shippingDays = 5;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + shippingDays);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-8">
                    <svg className="h-16 w-16 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-center mb-6">Order Placed Successfully</h1>
                <p className="text-gray-600 text-center mb-8">Thank you for your order! Your items are being prepared for shipping.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-green-100 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-700 mb-4">Estimated Delivery Date</h2>
                        <p className="text-green-700 mb-2">Your order will be delivered in approximately {shippingDays} days</p>
                        <p className="text-green-700">Estimated Delivery Date: {estimatedDeliveryDate.toLocaleDateString()}</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Shipping Details</h2>
                        <p className="text-blue-700 mb-2">Your order will be shipped via FedEx Ground.</p>
                        <p className="text-blue-700">You will receive a shipping confirmation email with a tracking number once your order has been shipped.</p>
                    </div>
                </div>

                <div className="bg-yellow-100 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-yellow-700 mb-4">Additional Information</h2>
                    <p className="text-yellow-700 mb-2">If you have any questions or concerns, please contact our friendly customer support team.</p>
                    <p className="text-yellow-700 mb-2">You can reach us by email at support@example.com or by phone at 1-800-555-1234.</p>
                    <p className="text-yellow-700">Our customer support team is available Monday to Friday, 9 AM to 5 PM EST.</p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessful;