import { Request, Response, NextFunction } from "express";



export async function processPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount, provider = "paystack", propertyId } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const paymentResponse = {
      status: "success",
      provider,
      amount,
      providerData: {
        paymentUrl: `https://payment.${provider}.com/checkout?amount=${amount}`, // ✅ fixed `htpps` → `https`
        reference: `REF-${Date.now()}`
      }
    };

    return res.status(200).json({
      message: "Payment processed successfully",
      payment: paymentResponse
    });

  } catch (error) {
    next(error);
  }
}
