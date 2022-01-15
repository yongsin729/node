const express= require('express');
const app= express();
app.use(express.urlencoded({extended: true})) ;

const MongoClient = require('mongodb').MongoClient;
app.set('view engine','ejs');
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
    응답.sendFile(__dirname+'/write.html');
});

app.post('/add',function(요청,응답){
    응답.send('전송완료');
    console.log(요청.body.title);
    console.log(요청.bodㅣiy.date);

    db.collection('post').insertOne({title:요청.body.title, date:요청.body.date},function(에러,결과){
        console.log('저장완료');
    });
});


app.get('/list',function(요청,응답){

    db.collection('post').find().toArray(function(에러,결과){
        console.log(결과);
        응답.render('list.ejs', {posts:결과});
    });
    
});