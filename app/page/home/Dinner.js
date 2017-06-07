import React, {Component} from 'react';

export default class Dinner extends Component {
    constructor(props) {
        super(props);
    }

    renderNumberStr(item) {
        if (item.number) {
            return <div className="sidebar-number">{item.number}</div>
        }
        return null;
    }
    handleAJump(id,e){
        console.log(id);
        let scrollValue = Math.abs($('.main').scrollTop() + $(id).offset().top - 50);
        console.log("scrollTop:",$(".main").scrollTop());
        console.log("scrollValue:",scrollValue);
        $(".main").scrollTop(scrollValue);
    }
    render() {
        // var types = this.props.typelist;
        // let typesStr = types.map((item, index) => {
        //     let id = `#${item.id}`;
        //     return (
        //         <li key={index} className={index == 0 ? 'active' : ''}>
        //             <a href={id}  onTouchTap={this.handleAJump.bind(this,id)}>
        //             {this.renderNumberStr(item)}
        //             <div>
        //                 <span>{item.name}</span>
        //             </div>
        //             </a>
        //         </li>)
        // })
        var types = this.props.typelist;
             let typesStr = types.map((item, index)=>{
                 let id = `#${item.id}`;
             	return (<li key={index} data-id={item.id} onTouchTap={this.handleAJump.bind(this,id)} data-target={"#"+item.id} className={index == 0 ? 'active' : ''}>
                     {this.renderNumberStr(item)}
                     <div>
                     	<span>{item.name}</span>
                     </div>
                 </li>)
             })

        function stopSideBarDrop() {
            if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
                var lastY;//最后一次y坐标点
                $('.sidebar').on('touchstart', function (event) {
                    lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
                });
                $('.sidebar').on('touchmove', function (event) {
                    var y = event.originalEvent.changedTouches[0].clientY;
                    var st = $('.sidebar').scrollTop(); //滚动条高度
                    if (y >= lastY && st <= 0) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
                        // console.log("下拉触发");
                        lastY = y;
                        event.preventDefault();
                    }
                    else if (y <= lastY && st >= $('.sidebar')[0].scrollHeight - $('.sidebar').height() - 80) {
                        // console.log("上拉触发");
                        lastY = y;
                        event.preventDefault()
                    }
                    lastY = y;
                });
            }

        }

        stopSideBarDrop();

        function menuLeft() {
            $(".nav >li").click(function () {
                $(".nav >li").removeClass('active');
                $(this).addClass('active');
            });
            $(".main").scroll(function () {
                let scrollTop = $(this).scrollTop();
                let mainHei = $(this).height();
                let contentHei = $(this)[0].scrollHeight;
               // console.info(scrollTop ,mainHei,contentHei)

                if(contentHei - scrollTop-50 -mainHei <=50){
                    if(contentHei - scrollTop-50 -mainHei<= 3){
                       // console.dir(scrollTop ,mainHei,contentHei)
                        $(".nav >li").removeClass('active');
                        $(".nav >li").last().addClass('active');
                    }
                   // console.dir(scrollTop ,mainHei,contentHei)
                    $(".nav >li").removeClass('active');
                    $(".nav >li").last().addClass('active');
                }
            })
        }
        menuLeft();
        return (
            <div className="sidebar">
                <ul className="nav">
                    {typesStr}
                </ul>
            </div>
        );
    }
};
// 左侧菜单单击
