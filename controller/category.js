import Category from '../model/category'
import formidable from 'formidable'
import fs from 'fs'
import _ from 'lodash'

export const Create = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtenstions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "404 k thể thêm danh mục1"
      })
    }
    //  kiểm tra dữ liệu có được nhập hay k
    const { name, description } = fields;
    if (!name || !description) {
      return res.status(400).json({
        error: " không được để trống !"
      })
    }

    let category = new Category(fields);

    if (files.image) {
      if (files.image.size < 0) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size"
        })
      }
      category.image.data = fs.readFileSync(files.image.path);
      category.image.contentType = files.image.type;
    }
    category.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Thêm danh mục không thành công 😂"
        })
      }
      res.json(data);
    })

  })


}

export const Read = (req, res) => {
  return res.json(req.category);
}

export const Update = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtenstions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "400 error update category"
      })
    }
    //kiem tra du lieu co duoc nhap hay k
    const { name, description } = fields;
    if (!name || !description) {
      return res.status(400).json({
        error: "ban can dien day du thong tin"
      })
    }
    let category = req.category;
    category = _.assignIn(category, fields);

    if (Object.keys(files).length != 0) {
      if (files.image) {
        if (files.image.size < 0) {
          return res.status(400).json({
            error: "Image should be less than 1mb in size"
          })
        }
        category.image.data = fs.readFileSync(files.image.path);
        category.image.contentType = files.image.type;
      }
    }

    category.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "update san pham  k thanh cong"
        })
      }
      res.json(data);
    })

  })
}
export const countProductOfCategory = (req, res) => {
  Category.aggregate(
    [

      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'productList'
        }
      }
    ]
  )
  .exec((err,data)=>{
    if (err) {
      return res.status(400).json({
        error: "k xoa duoc category"
      })
    }
    res.json(data);
  })
}

export const Delete = (req, res) => {
  let category = req.category;

  category.remove((err, deletecategory) => {
    if (err) {
      return res.status(400).json({
        error: "k xoa duoc category"
      })
    }
    res.json({
      deletecategory,
      message: "xoa category thanh cong !"
    }
    )
  })
}

export const CategoryId = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: " k tìm thấy sản phẩm"
      })
    }
    req.category = category;
    next();
  })
}

export const List = (req, res) => {
  Category.find((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "k list category"
      })
    }
    res.json(data);
  })
}
export const Image = (req, res, next) => {
  if (req.category.image.data) {
    res.set("Content-Type", req.category.image.contentType);
    return res.send(req.category.image.data);
  }
  next();
}
export const countCategory = (req, res) => {
  Category.count({}).exec((err, count) => {
    if (err) {
      return res.status(400).json({
        error: "k count duoc Category"
      })
    }
    // req.product = count;
    return res.json(count);
  })
}