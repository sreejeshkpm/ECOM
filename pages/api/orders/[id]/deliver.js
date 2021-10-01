
import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';

const handler = nc({
    onError,
});
handler.use(isAuth);
handler.get(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
        };
        const deliveredOrder = await order.save();
        await db.disconnect();
        res.send({ message: 'order delivered', order: deliveredOrder });
    } else {
        await db.disconnect();
        res.status(404).send({ message: 'order not found' });
    } 
});

export default handler;