const SECOND = "秒";
const MINUTE = "分";
const HOUR = "小时";
const DAY = "天"

export function timeStamp( second_time ){
    var time = parseInt(second_time) + SECOND;  
    if( parseInt(second_time )> 60){  

        var second = parseInt(second_time) % 60;  
        var min = parseInt(second_time / 60);  
        time = min + MINUTE + second + SECOND;  

        if( min > 60 ){  
            min = parseInt(second_time / 60) % 60;  
            var hour = parseInt( parseInt(second_time / 60) /60 );  
            time = hour + HOUR + min + MINUTE + second + SECOND;  

          	if( hour > 24 ){  
                hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
                var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
                time = day + DAY + hour + HOUR + min + MINUTE + second + SECOND;  
            }  
        }
    } 
    return time;          
}