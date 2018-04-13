// 格式验证

export default {
    email(string) {
        let reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(string)) {
            return true
        }
        return false
    },
    mobile(string) {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (reg.test(string)) {
            return true
        }
        return false
    },
    url(string){
        let reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if(reg.test(string)){
            return true
        }
        return false
    }
}