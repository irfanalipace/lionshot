// import { reject } from "lodash"

const resp={
    data:{
        data:[
            {
                id:1,
                item_id:"IT33B2",
                item_image:''
            },
            {
                id:1,
                item_id:"IR3N2",
                item_image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqGImAu6h6L-0PkBZnNkkHUYpC6LkdhiETHA&usqp=CAU'
            },
            {
                id:1,
                item_id:"IT33B2",
                item_image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqGImAu6h6L-0PkBZnNkkHUYpC6LkdhiETHA&usqp=CAU'
            },
            {
                id:4,
                item_id:"B45RT",
                item_image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqGImAu6h6L-0PkBZnNkkHUYpC6LkdhiETHA&usqp=CAU'
            }
        ]
    }
}

export function getImageItem(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(resp);
        }, 3000)
    })
}