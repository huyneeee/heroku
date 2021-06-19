import Order from '../model/order';
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const Create = (req, res) => {

    let order = new Order(req.body);
    order.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: "Thêm order không thành công 😂"
            })
        }
        let msg = {
            to: order.email, // Change to your recipient
            from: process.env.EMAIL_FROM, // Change to your verified sender
            subject: 'Đặt hàng thành công !',
            html: `<b>Cảm ơn bạn đã hàng !</b> <br> 
                Mã đơn hàng: <b>${data._id}</b> <br>
                Người nhận : <b>${data.name_of_consignee}</b> <br>
                Tổng tiền : <b>$${data.subtotal}.00</b> <br>
                Địa chỉ nhận hàng : <b>${data.address}</b> <br>
                <b>Đơn hàng của bạn sẽ sớm được chúng tôi xác nhận !</b>
                `,
        }
        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
            })
            .catch((error) => {
                console.error(error)
            })
        res.json(data);
    })
}
export const update = (req, res) => {
    Order.findOneAndUpdate(
        { _id: req.order._id },
        { $set: req.body },
        { new: true },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: 'k the update order'
                })
            }
            let msg = {
                to: order.email, // Change to your recipient
                from: process.env.EMAIL_FROM, // Change to your verified sender
                subject: 'Cập nhật đơn hàng !',
                html: `Đơn hàng : <b> ${order._id} </b> của bạn  ${order.status === 1 ? '<b>Đang giao hàng!</b>' : ''} ${order.status === 2 ? '<b>Đã giao hàng!</b>' : ''} ${order.status === 3 ? '<b>Đã bị hủy</b>' : ''}`,
            }
            sgMail
                .send(msg)
                .then((response) => {
                    console.log(response[0].statusCode)
                })
                .catch((error) => {
                    console.error(error)
                })
            res.json(order);
        }
    )
}

export const orderId = (req, res, next, id) => {
    Order.findById(id).exec((err, order) => {
        if (err) {
            res.status(400).json({
                error: "K tìm thấy order"
            })
        }
        req.order = order;
        next();
    })
}
export const Read = (req, res) => {
    return res.json(req.order);
}
export const Delete = (req, res) => {
    let order = req.order;
    order.remove((err, deleteOrder) => {
        if (err) {
            res.status(400).json({
                error: "K xóa được order"
            })
        }
        res.json({
            deleteOrder,
            massage: "Xóa thành công"
        })
    })
}
export const List = (req, res) => {
    Order.find((err, data) => {
        if (err) {
            res.status(400).json({
                error: "K tìm thấy order nào"
            })
        }
        res.json(data);
    })
}
export const countOrder = (req, res) => {
    Order.count({}).exec((err, count) => {
        if (err) {
            return res.status(400).json({
                error: "k count duoc order"
            })
        }
        // req.product = count;
        return res.json(count);
    })
}
export const orderByUser = (req, res) => {
    const id = req.query.userid;
    Order.find({ id_order_maker: id }).exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "K tim thay order"
            })
        }
        return res.json(order)
    })
}
export const orderByStatus = (req, res) => {
    const stutus = req.query.status;
    Order.find({ status: stutus }).exec((err, orders) => {
        if (err) {
            return res.status(400).json({
                error: "K tim thay order"
            })
        }
        return res.json(orders)
    })
}

export const orderRecent = (req, res) => {
    Order.find({ status: 0 }).exec((err, orders) => {
        if (err) {
            return res.status(400).json({
                error: "k tim thay order "
            })
        }
        return res.json(orders)
    })
}
export const totalOrderInMonth6 = (req, res) => {
    Order.aggregate(
        [
            {
                $match: { status: 2 }
            },
            {
                $group:
                {
                    _id: { day: { $dayOfMonth: "$createdAt" } },
                    totalAmount: { $sum: "$subtotal" }
                }

            }
        ]
    )
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "k tim thay order "
                })
            }
            return res.json(data)
        })
}

// db.getCollection('orders').aggregate(
//     [
//       {
//         $group:
//           {
//             _id: { day: { $dayOfMonth: "$createdAt"}},
//             totalAmount: { $sum:  "$subtotal" }
//           }

//       }
//     ]
//  )
// db.getCollection('orders').aggregate(
//     [
//       {
//         $group:
//           {
//             _id: { day: { $dayOfMonth: "$createdAt"}},
//             totalAmount: { $sum: { $multiply: [ "$subtotal", 1 ] } }
//           }

//       }
//     ]
//  )