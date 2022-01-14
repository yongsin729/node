const express= require('express');
const app= express();
app.use(express.urlencoded({extended: true})) ;

app.listen(8000,function(){//서버띄울 포트번호, 띄운후 실행할코드
    console.log('listening on 8080')
});

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
    console.log(요청.body.date  );
});