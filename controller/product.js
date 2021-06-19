import Product from '../model/product';
import formidable from 'formidable'
import fs from 'fs'
import _ from 'lodash'

export const Create = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtenstions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "404 k thể thêm sản phẩm"
      })
    }
    //  kiểm tra dữ liệu có được nhập hay k
    const { name, description, price } = fields;
    if (!name || !description || !price) {
      return res.status(400).json({
        error: " không được để trống !"
      })
    }

    let product = new Product(fields);

    if (files.image) {
      if (files.image.size > 3000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size"
        })
      }
      product.image.data = fs.readFileSync(files.image.path);
      product.image.contentType = files.image.type;
    }
    product.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Thêm sản phẩm không thành công 😂"
        })
      }
      res.json(data);
    })

  })


}

export const Read = (req, res) => {
  return res.json(req.product);
}

export const Update = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtenstions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "400 error update product"
      })
    }
    //kiem tra du lieu co duoc nhap hay k
    const { name, description, price, status } = fields;
    if (!name || !description || !price || !status) {
      return res.status(400).json({
        error: " không được để trống !"
      })
    }
    let product = req.product;
    product = _.assignIn(product, fields);
    if (Object.keys(files).length != 0) {
      if (files.image) {
        if (files.image.size > 3000000) {
          return res.status(400).json({
            error: "Image should be less than 3mb in size"
          })
        }
        product.image.data = fs.readFileSync(files.image.path);
        product.image.contentType = files.image.type;
      }
    }


    product.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "update san pham  k thanh cong"
        })
      }
      res.json(data);
    })

  })
}

export const Delete = (req, res) => {
  let product = req.product;

  product.remove((err, deleteProduct) => {
    if (err) {
      return res.status(400).json({
        error: "k xoa duoc product"
      })
    }
    res.json({
      deleteProduct,
      message: "xoa product thanh cong !"
    }
    )
  })
}

export const ProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err) {
      return res.status(400).json({
        error: " k tìm thấy sản phẩm"
      })
    }
    req.product = product;
    next();
  })
}

export const List = (req, res) => {
  Product.find((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "k list product"
      })
    }
    res.json(data);
  })
}
export const countProduct = (req, res) => {
  Product.count({}).exec((err, count) => {
    if (err) {
      return res.status(400).json({
        error: "k count duoc product"
      })
    }
    // req.product = count;
    return res.json(count);
  })
}
// router.get("/product/photo/:productId", photo)
export const Image = (req, res, next) => {
  if (req.product.image.data) {
    res.set("Content-Type", req.product.image.contentType);
    return res.send(req.product.image.data);
  }
  next();
}


export const ProductByCateId = (req, res, next, cate_id) => {

  Product.find({ category: cate_id }).exec((err, product) => {

    if (err) {
      res.status(400).json({
        error: "k thay san pham theo cate"
      })
    }
    req.product = product;
    next();
  })
}

export const ProductByTextSearch = (req, res, next, textSearch) => {
  Product.find({ "name": { $regex: textSearch, $options: 'i' } }).exec((err, product) => {

    if (err) {
      res.status(400).json({
        error: "product not found for text search"
      })
    }
    req.product = product;
    next();
  })
}
export const ProductByPrice = (req, res) => {
  let gte = req.query.gte;
  let lte = req.query.lte;
  Product.find({ price: { $gte: gte, $lte: lte } }).exec((err, product) => {
    if (err) {
      res.status(400).json({
        error: "Product not found for price"
      })
    }
    req.product = product;
    res.json(req.product);
  })
}
export const ProductPagination = (req, res) => {
  let _page = Number(req.query.page);
  let _limit = Number(req.query.limit);
  let gte = Number(req.query.gte);
  let lte = Number(req.query.lte);
  let cateId = req.query.cateId;

  const pagination = {
    _page: _page,
    _limit: _limit,
    _total : 12
  }
  if (!lte && !cateId) {
    Product.find({ price: { $gte: gte ? gte : 0 } })
      .skip((_limit * _page) - _limit) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(_limit)
      .exec((err, product) => {
        if (err) {
          res.status(400).json({
            error: "product not found page"
          })
        }
        req.product = product;
        return res.json({
          data: req.product,
          pagination: pagination
        });
      });
  } else if (cateId && lte) {
    Product.find({ price: { $gte: gte ? gte : 0, $lte: lte },category: cateId })
      .skip((_limit * _page) - _limit) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(_limit)
      .exec((err, product) => {
        if (err) {
          res.status(400).json({
            error: "product not found page"
          })
        }
        req.product = product;
        return res.json({
          data: req.product,
          pagination: pagination
        });
      });
  } else if (lte) {
    Product.find({ price: { $gte: gte ? gte : 0, $lte: lte } })
      .skip((_limit * _page) - _limit) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(_limit)
      .exec((err, product) => {
        if (err) {
          res.status(400).json({
            error: "product not found page"
          })
        }
        req.product = product;
        return res.json({
          data: req.product,
          pagination: pagination
        });
      });
  } else if (cateId) {
    Product.find({ price: { $gte: gte ? gte : 0 }, category: cateId })
      .skip((_limit * _page) - _limit) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(_limit)
      .exec((err, product) => {
        if (err) {
          res.status(400).json({
            error: "product not found page"
          })
        }
        req.product = product;
        return res.json({
          data: req.product,
          pagination: pagination
        });
      });
  }

}
export const listRelated = (req, res) => {
  Product.find({
    _id: { $ne: req.product },
    category: req.product.category
  })
    .populate('category', '_id name',)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          error: "Products not found"
        })
      }
      return res.json(products);
    })
}
export const listBySearch = () => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? +req.query.limit : 6;
  let skip = parseInt(req.body.skip);
  let findArgs = {}


  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte - greater than price [0 - 10]
        // lte - nhỏ hơn 
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  Product.find(findArgs)
    .select("-image")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Products not found"
        })
      }
      res.json({
        size: data.length,
        data
      })
    });
}
export const getImage = (req, res) => {
  const id = req.query.id;
  Product.findById(id).exec((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "k tim thay product"
      })

    }
    if (product.image.data) {
      res.set("Content-Type", product.image.contentType);
      return res.send(product.image.data);
    }
  })

}
export const sumProductOfCate = (req, res) => {
  Product.aggregate(
    [
      {
        $group:
        {
          _id: "$category",
          count: { $sum: 1 }
        }

      }
    ]
  )
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "k tim thay"
        })
      }
      return res.json(data);
    })
}