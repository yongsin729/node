const express= require('express');
const app= express();
app.use(express.urlencoded({extended: true})) ;

const MongoClient = require('mongodb').MongoClient;
app.set('view engine','ejs');

app.use('/public',express.static('public'));//스태틱 파일을 보관하기 위해public 폴더를 사용. 
MongoClient.connect('mongodb+srv://yongsin729:7963dt@cluster0.rscxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
function(에러,client){
    //연결되면 할 일
    if(에러) return console.log(에러);

    db=client.db('todoapp');

    db.collection('post').insertOne({name : 'yunghsin',_id:25},function(에러,결과){
        console.log('저장완료');
    });

    app.listen(8000,function(){//서버띄울 포트번호, 띄운후 실행할코드
        console.log('listening on 8080')
    });
})



app.get('/pet',function(요청,응답){
    응답.send('반갑습니다');
});



app.get('/',function(요청,응답){
    응답.sendFile(__dirname+'/index.html');
});



app.get('/write',function(요청,응답){

    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과);
        응답.render('write.ejs', {posts:결과});
    });
    
});
app.post('/add',function(요청,응답){
    응답.render('write.ejs');
    db.collection('counter').findOne({name:'게시물갯수'},function(에러,결과){
        console.log(결과.totalPost);
        let 총게시물갯수=결과.totalPost;
        db.collection('post').insertOne({_id:총게시물갯수+1,title:요청.body.title, date:요청.body.date},function(에러,결과){
            console.log('저장완료');
            db.collection('counter').updateOne({name:'게시물갯수'},{$inc : {totalPost:1}},function(에러,결과){
                if(에러) {return console.log(에러)};
            });//데이터 수정.

        });

        
    });
   
});


app.get('/list',function(요청,응답){

    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과);
        응답.render('list.ejs', {posts:결과});
    });
    
});

app.delete('/delete',function(요청,응답){
    console.log(요청.body);
    요청.body._id=parseInt(요청.body._id);
   db.collection('post').deleteOne(요청.body,function(에러,결과){
    console.log('삭제완료');
    응답.status(200).send({message:'성공'});
   });
})

app.get('/detail/:id',function(요청,응답){
    db.collection('post').findOne({_id:parseInt(요청.params.id)},function(에러,결과){  //{_id:요청.params.id는 /detail/: id 에 있는 id의 값을 가져옴
        console.log(결과);
        응답.render('detail.ejs',{data:결과});
    })
    
})

app.get('/edit/:id',function(요청,응답){
    
    응답.render('edit.ejs')
})