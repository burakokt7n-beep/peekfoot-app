const p=require("@expo/config-plugins");
module.exports=c=>p.withAndroidManifest(c,m=>{
m.modResults.manifest["uses-permission"].push({$:{"android:name":"com.google.android.gms.permission.AD_ID"}});return m;});
