import Blog from '../model/blog'
import formidable from 'formidable'
import fs from 'fs'
import _ from 'lodash'

export const Create = (req,res) => {
    let form = formidable.IncomingForm();
    form.keepExtenstions = true;
    form.parse(req, (err,fields, files) => {
        if(err){
            return res.status(400).json({
                error : "404 k thể thêm blog"
            })
        }
        //  kiểm tra dữ liệu có được nhập hay k
        const { name , content  } = fields ;
        if(!name || !content ){
            return res.status(400).json({
                error : " không được để trống !"
            })
        }

        let blog = new Blog(fields);

        if (files.image) {
            if (files.image.size < 0) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                })
            }
            blog.image.data = fs.readFileSync(files.image.path);
            blog.image.contentType = files.image.type;
        }
        blog.save((err,data)=>{
            if(err){
                res.status(400).json({
                    error : "Thêm blog không thành công 😂"
                })
            }   
            res.json(data);
        })
    
    }) 


}

export const Read = (req,res) =>{
    return res.json(req.blog);
}

export const Update = (req,res) =>{
  let form = formidable.IncomingForm();
  form.keepExtenstions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "400 error update category"
      })
    }
    //kiem tra du lieu co duoc nhap hay k
    const { name, content } = fields;
    if (!name  || !content ) {
      return res.status(400).json({
        error: "ban can dien day du thong tin"
      })
    }
    let blog = req.blog;
    blog = _.assignIn(blog,fields);
    if (Object.keys(files).length != 0) {
      if (files.image) {
        if (files.image.size <0) {
            return res.status(400).json({
                error: "Image should be less than 1mb in size"
            })
        }
        blog.image.data = fs.readFileSync(files.image.path);
        blog.image.contentType = files.image.type;
    }
    }
    

    blog.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "update blog k thanh cong"
        })
      }
      res.json(data);
    })

  })
}

export const Delete = (req,res) =>{
    let blog = req.blog;

    blog.remove((err)=>{
      if(err){
        return res.status(400).json({
          error : "k xoa duoc blog"
        })
      }
      res.json({
        message : "xoa blog thanh cong !"
      }
      )
    })
}

export const blogById = ( req,res,next,id) =>{
  Blog.findById(id).exec((err,blog) =>{
      if(err){
          return res.status(400).json({
              error : " k tìm thấy blog"
          })
      }
      req.blog = blog ;
      next();
  })
}

export const List = (req,res)=>{
  Blog.find((err,data)=>{
      if(err){
          return res.status(400).json({
            error : "k list blog"
          })
        }
        res.json(data);
  })
}
export const Image = (req, res, next) => {
    if (req.blog.image.data) {
        res.set("Content-Type", req.blog.image.contentType);
        return res.send(req.blog.image.data);
    }
    next();
}