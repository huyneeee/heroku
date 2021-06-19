import Contact from  '../model/contact'
import _ from 'lodash'

export const Create = (req,res) =>{
 
        let contact = new Contact(req.body);

        contact.save((err,data)=>{
            if(err){
                res.status(400).json({
                    error : "Thêm contact không thành công 😂"
                })
            }
            res.json(data);
        })

}
export const contactId = (req,res,next,id)=>{
    Contact.findById(id).exec((err,contact)=>{
        if(err){
            res.status(400).json({
                error : "K tìm thấy contact"
            })
        } 
        req.contact = contact;
        next();
    })
}
export const Read = (req,res)=>{
    return res.json(req.contact);
}
export const Delete = (req,res)=>{
    let contact = req.contact;
    contact.remove((err,deleteContact)=>{
        if(err){
            res.status(400).json({
                error : "K xóa được contact"
            })
        }
        res.json({
            deleteContact,
            massage : "Xóa thành công"
        })
    })
}
export const List = (req,res)=>{
    Contact.find((err,data)=>{
        if(err){
            res.status(400).json({
                error : "K tìm thấy contact nào"
            })
        }
        res.json(data);
    })
}