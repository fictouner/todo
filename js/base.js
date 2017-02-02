    ;(function () {
        'use strict'; //严格模式，也是定义全局变量的地方。




         var $form_add_task = $('.add-task')
             ,$window = $(window) //不要引号
             ,$body = $('body')
              ,$delete_task
             ,$task_item
             ,$on_detail
             ,$task_detail = $('.task-detail')
             ,$task_detail_mast = $('.task_detail-mask')
             ,$update_form   //更新form
             ,$checkbox_complete
             ,$msg = $('.msg')
             ,$msg_content = $('.msg .msg-content')
             ,$msg_event = $('.msg .msg-btn')
             ,$msg_audio = $('audio')
           ,task_list = []
          ;


          init();
          //点击添加task事件

         $form_add_task.on('click','button[type=submit]',function (e) {
             var new_task = {};
             // 禁止默认行为
             e.preventDefault();
             // 获取task的值
                var $input = $('.add-task input[name=content]');
                 new_task.content = $input.val();

             // 判断task是否空
                 if (!new_task.content) return;
                // 新的task存起来
                  if(add_task(new_task)) {
                      $input.val('');
                  }
         });

        function add_task(new_task) {
            // 将新的task推入到task_list
            task_list.push(new_task);
            // 更新LocalStorage
            refresh_task_list();  //更新到本地
            return true;
        }

        //刷新LocalStorage数据并更新渲染模板（tpl）

        function refresh_task_list() {
            store.set('task_list',task_list);
            render_task_list();
        }

        //自定义alert弹出
        function my_alert(index,agrs) {
            if(!index ||!agrs) return null;

        var  $box    //conf ={} 配置   //弹框的时候不打算显示内容了 就不用使用conf了
            ,$mask  //弹出的时候遮盖其他
            ,$sure
            ,$cancel;

            // if (typeof agrs == 'string') //判断参数类型，str就赋值给alert-title
            //     conf ={content:agrs} ;
            // else   //不是的话一般就是对象
            //     conf = $.extend({},conf,agrs);//扩展对象。[deep]空或者false 浅拷贝。conf作为目标对象，arg新的对象属性。P219

          $box = $('<div>' +
              '<div class="alert-title"> 确定要删除吗？</div>' +
              '<div class="alert-btn">' +
                  '<button class="sure">确定</button>' +
                  '<button class="cancel">取消</button>' +
              '</div>'+
              '</div>') //定义弹框样式,不能有单位，结尾，
              .css({
                  position : 'fixed',
                  'min-width': 300,
                  'min-height': 100,
                  background: '#e74c3c',
                  color: '#fff',
                 'border_radius':3,
                  'box-shadow':'0 1px 2px rgba(0,0,0,.5)',
                  transition: 'all 0.5s 0.1s'
              });

              $box.find('.alert-btn').css({ //.alert-btn
                'margin-left' : 120
                 });

             $box.find('.alert-title').css({  //.alert-title
                padding:'5px 10px',
                'font-weight': 400,
                'font-size' : '1.2em',
                  margin:'10px 10px'
            });

            $sure = $box.find('.sure').css({
                'min-width':60,
               'min-height':30,
                'text-align':'center',
                padding:1,
                color: '#ddd',
                'margin-right':8,
                background:'#c0392b'
            }).hover( function () {
                    $sure.css( {
                        'font-size':'1.2em' ,
                        color: '#fff',
                        background:'#A5281B'
                    });
                },
                function () {
                    $sure.css({
                        'font-size':'1em' ,
                        color: '#ddd',
                        background:'#c0392b'
                    });
                });


            $cancel = $box.find('.cancel').css({
                'min-width':60,
                'min-height':30,
                padding:1,
                'text-align':'center',
                color: '#ddd',
                background:'#c0392b'
            }).hover( function () {
                    $cancel.css( {
                        'font-size':'1.2em' ,
                        color: '#fff',
                        background:'#A5281B'
                    });
                },
                function () {
                    $cancel.css({
                        'font-size':'1em' ,
                        background:'#c0392b',
                        color: '#ddd'
                    });
                });


            $mask = $('<div></div>')
              .css({
                  position : 'fixed',
                  top:0,
                  bottom:0,
                  left:0,
                  right:0,
                  background:'rgba(143,27,15,0.5)',
                  transition: 'all 0.5s'
              });

            $window.on('resize',function () {
                responsive_box();
            });

            //获取动态浏览器宽高，来固定盒子弹出的位置
          function responsive_box() {
              var window_w, window_h, box_w, box_h, move_x, move_y;
              window_w = $window.width();
              window_h = $window.height();
              box_w = $box.width();
              box_h = $box.height();
              move_x = (window_w - box_w)/2;
              move_y= ((window_h - box_h)/2) - 150;

              $box.css({
                   left : move_x,
                   top : move_y
               })
          }



            $mask.appendTo($body);
            $box.appendTo($body);
            $window.resize();



            $sure.on('click',function () {
                delete_task(index);
                $box.hide(50);
                $mask.hide(100);
                refresh_task_list();
            });

            $cancel.on('click',function () {
                $box.hide(50);
                $mask.hide(100);
            })


        }




        //查找并监听所有按钮的点击事件

        function lisenter() {

            //双击显示
            $task_item.on('dblclick',function () {
                var $this = $(this);
                var index = $this.data('index');

                //渲染指定index   task的详情信息
                render_task_detail(index);

                //显示详情
                $task_detail.show();

                //显示遮罩
                $task_detail_mast.show();
            });



            //删除按钮点击事件
            $delete_task.on('click',function () {
                var $this = $(this);
                //找到删除按钮所在的task元素
                var $item = $this.parent().parent();
                var index = $item.data('index');

                my_alert(index,task_list[index]);

            });



            //详情按钮点击事件
            $on_detail.on('click',function () {
                var $this = $(this);
                var $item = $this.parent().parent();
                var index = $item.data('index');

                //渲染指定index   task的详情信息
                render_task_detail(index);

                //显示详情
                $task_detail.show();

                //显示遮罩
                $task_detail_mast.show();
            });

            //隐藏task详情点击事件
            $task_detail_mast.on('click',function () {
                    $task_detail.hide();
                    $task_detail_mast.hide();
            });

            //监听checked事件，判断是否完成，以便分类排序
            $checkbox_complete.on('click',function () {
                var $this = $(this);
                //因为不管checkbox状态是否改变，只是记录到store里，所以需要判断来改变记录的状态，
                // 否则一直是第一次点击状态true
                //再根据这个判断在  页面的勾 打上或不打（在list_item_tpl决定）
                var index = $this.parent().parent().data('index');
                var item = store.get('task_list')[index]; //获取item

                //给item添加done属性和值
                if (item.done)  //如果原来有的话，点了就false
                    update_task(index,{done:false});

                else            //如果原来没有的话，点了就true
                    update_task(index,{done:true});
            });

            //监听知道了按钮事件,点击知道了
            $msg_event.on('click',function () {

                setTimeout( function () {
                  $msg.hide('normal');
                    $msg_audio.removeAttr('autoplay loop');
                },200);
            });


        }


        //删除一条task
        function delete_task(index) {
            if (index === undefined || !task_list[index]) return null;
            delete  task_list[index];
            // 更新LocalStorage
            refresh_task_list();

        }


        function init() {
            // store.clear();
            task_list = store.get('task_list') || [];
            if (task_list.length)
                render_task_list();
            time_control();

        }

        function time_control() {
            //var $this = $(this);

            var now_time,control_time,time_difference ;

             setInterval(function () {
                     for(var i = 0,long = task_list.length; i<long;i++){
                         var item = store.get('task_list')[i]  ;
                         if (!item || !item.remind_date|| item.informed )
                                continue;

                         control_time = new Date(item.remind_date).getTime();
                        now_time = new Date().getTime();
                       time_difference = (control_time - now_time); //得到毫秒数的差
                         console.log(time_difference);
                       if ( time_difference <= 0){
                           update_task(i,{informed:true}); //设置true代表提醒过了
                           show_msg(item);     //inform（通知的意思）函数执行-->提醒。。。。
                       }
                }
            },300);
        }

        function show_msg(item) {
            if(!$msg) return;
            $msg_content.html(
                '<h3>'+item.content+'</h3>'+
                ''+item.desc+''+
                    ''+ item.remind_date +''
            );
           $msg_audio.attr('autoplay','');
            $msg.show();
        }



        //渲染全部task模板
        function render_task_list() {
             var $task_list = $('.task-list');
             $task_list.html('');
            for (var i = 0 ,long = task_list.length ;i < long;i++){
                var $task = render_task_tpl(task_list[i], i);
                if (task_list[i] == null) {}  //以后要注意判断null的可能性 ！！
                else {
                    if(task_list[i].done){
                        $task_list.append($task);//true的排后面，样式要改变
                        $task.addClass('is-done');
                    }
                    else
                        $task_list.prepend($task);// prepend 和append 顺序相反,因为前面用的是push 所以要用prepend才能将显示正序
                }
            }

            //定义在渲染全部task模板函数内，这样的话才能在lisenter()监听点击的某一个，否在有很多，无法实现点击事件
            $delete_task = $('.action-delete');
            $on_detail = $('.action-detail');
            $checkbox_complete = $('.task-list .complete');
            $task_item = $('.task-item');
            lisenter();

        }

        //渲染单条task模板
        function render_task_tpl(data,index) {
            if(!data || !index) return null;

            var list_item_tpl =
                    '<div class="task-item" data-index="'+ index +'"> '+
                    '<span><input class="complete" '+ ( data.done? 'checked': '' ) + ' type="checkbox"></span>'+
                    '<span class="task-content">'+data.content+'</span>'+
                     '<span class="action">'+
                        '<span class="action-delete"> 删除</span>'+
                        '<span class="action-detail"> 详细</span>'+
                      '</span>'+
                    '</div>';
                return $(list_item_tpl);//创建动态元素的jquery对象方法
        }


        //渲染指定index   task的详情信息

        function render_task_detail(index) {
            if (index===undefined || !task_list[index] ) return;
            var item = task_list[index];
            if (item.desc === undefined )   item.desc ='';
            var list_detail_tpl =
                '<form>'+
                 '<div class="input-item"><!-- 任务标题开始 --> '+
                '<input type="text" name="content" value="'+ item.content +'"> '+

                '</div><!-- 任务标题结束 -->'+

                '<div> <!-- 任务描述开始 -->'+
                '<div class="desc input-item">'+
                '<textarea name="desc" >'+ item.desc +'</textarea>'+
                '</div>'+
                '</div> <!-- 任务描述结束 -->'+
                '<div class="remind"><!-- 任务定时提醒开始 -->'+
                ' <lable>提醒时间</lable> '+
                '<input class="input-item"  id="datetimepicker" type="text" value="'+ (item.remind_date || '')+'">'+
                '<button  type="submit">更新</button>'+
                '</div> <!-- 任务定时提醒结束 -->'+
                '</div> ' +
                '</form><!-- 任务详情结束 -->';


            //更新模板，用新模板替换旧模板
            $task_detail.html(null);
            $task_detail.html(list_detail_tpl);

            //调用时间
            $('#datetimepicker').datetimepicker();

            //获取form元素，是要更新按钮事件
            $update_form = $task_detail.find('form');

            //点击更新按钮事件
            $update_form.on('submit',function () {
                //e.preventDefault();
                var data = {};

                //准备好要更新的3份数据
                data.content = $(this).find('[name=content]').val();
                data.desc = $(this).find('[name=desc]').val();
                data.remind_date = $(this).find('#datetimepicker').val();
                data.informed = false; //点更新了 就没提醒
                data.done = false;      //没有做
                //更新task数据-
                update_task(index,data);
            })


        }
        //更新task数据
       function update_task(index,data){
           if(!task_list[index] || !index) return ;
            task_list[index] = $.extend({},task_list[index],data) ; //{},旧数据，新数据，扩展对象属性
            refresh_task_list();
       }


})();