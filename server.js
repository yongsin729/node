const express= require('express');
const app= express();
app.use(express.urlencoded({extended: true})) ;

const MongoClient = require('mongodb').MongoClient;
const methodOverride=require('method-override');
app.use(methodOverride('_method'))
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
    응답.redirect('/write');
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
    db.collection('post').findOne({_id:parseInt(요청.params.id)},function(에러,결과){
        응답.render('edit.ejs',{post:결과});
    })
    
})

app.put('/edit',function(요청,응답){
    db.collection('post').updateOne({_id: parseInt(요청.body.id)},{$set:{title : 요청.body.title,date:요청.body.date}},function(에러,결과){
        console.log('수정완료');
        응답.redirect('/list');//응답시 이동 , 필수
    })
})// put 태그

const passport= require('passport');
const LocalStrategy =require('passport-local').Strategy;
const session =require('express-session');

app.use(session({secret:'비밀코드',resave:true,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
//app.use 미들웨어, 웹서버는 요청-응답 해주는 머신

app.get('/login',function(요청,응답){
    console.log(요청.user);
    응답.render('login.ejs');
})

app.post('/login',passport.authenticate('local',{
    failureRedirect:'/fail'//회원인증 실패하면 /fail로 이동. 
}),function(요청,응답){
   응답.redirect('/')
});


passport.use(new LocalStrategy({//인증하는 방법이 Strategy
    usernameField: 'id',
    passwordField: 'pw',
    session: true,//세션을 저장할 것인지. 
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {//암호화되지 않음  
        return done(null, 결과)//done() -> (서버에러, 다 맞을시 사용자DB 데이터 단 틀렸을 경우 false ,에러메세지)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });//세션을 저장시키는 코드 use id , -> 쿠키생성 ,
  
  passport.deserializeUser(function (아이디, done) {
   db.collection('login').findOne({id:아이디},function(에러,결과){//여기서 아이디==test
    done(null,결과);
   })
   
  }); //로그인한 유저의 세션아이디를 바탕으로 개인정뵈를 DB에서 찾는 역할 

  app.get('/mypage',로그인했니,function(요청,응답){//미들웨어  get요청시 마다 function work
    응답.render('mypage.ejs',{사용자:요청.user});
});

function 로그인했니(요청, 응답, next) { 
    if (요청.user) { 
      next() 
    } 
    else { 
      응답.send('로그인안하셨는데요?') 
    } 
  } 

  app.get('/search',(요청,응답)=>{
      let 검색조건= [
        {
            $search: {
              index: 'titleSearch',//index name 
              text: {
                query: 요청.query.value,
                path: 'title'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
              }
            }
          },
          {$sort:{_id:1}} // use sort = 1 or -1
      ];
      db.collection('post').aggregate(검색조건).toArray((에러,결과)=>{
          console.log(결과)
          응답.render('search.ejs',{posts:결과});
      });
  })//hard to use in korean,japanese -> use aggregate

  app.get('/result',(요청,응답)=>{
      응답.render('result.ejs');
  })


  // binary search -> Create Index 