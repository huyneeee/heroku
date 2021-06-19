import OrderDetail from '../model/orderDetail';
export const Create = (req,res)=>{

        let orderDetail = new OrderDetail(req.body);
        console.log(orderDetail);
        orderDetail.save((err,data)=>{
            if(err){
                res.status(400).json({
                    error : "Thêm orderDetail không thành công 😂"
                })
            }
            res.json(data);
        })

}
export const List = (req,res) =>{
    OrderDetail.find((err,data)=>{
        if(err){
            res.status(400).json({
                error : "k tim thay order detail nao"
            })
        }
        res.json(data);
    })
}
export const Read = (req,res)=>{
    return res.json(req.orderDetail);
}
export const OrderDetailByOrderId = (req,res,next,id_order)=>{
    OrderDetail.find({id_order :id_order}).exec((err,orderDetail)=>{
        if(err){
            res.status(400).json({
                error : "k tim thay order detail theo id order"
            })
        }
        req.orderDetail=orderDetail;
        next();
    })
}
