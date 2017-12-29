
// var testjson = require('./test.json');

var _looks = {};
var looks = {};
var sOutLine = {};
var sEyebrow = {};
var sEye = {};
var sNose = {};
var sMouth = {};
var sEyebrow = {};
var outLineScore;
var eyebrowScore;
var eyeScore;
var noseScore;
var mouthScore;
var looksTotalScore;
var sKanXiang = {};
var kanXiangScore;
var testValue = {};
var landmark = {};
var face = {};
var ima_width;
var ima_height;

function Init(face, width, height) {

    if (null == face || null ==face.landmark || face.landmark.contour_chin.x==0 || face.landmark.nose_contour_lower_middle.x==0) {return "face 数据为空！"};
    landmark = face.landmark;
    ima_width = width;
    ima_height = height;
    // looks.landmark = landmark;
    looks.Ima_width = width;
    looks.Ima_height = height;
    looks.Face = face;
    
    //计算公共参数
    var noseStartPoint = Center(face.landmark.nose_contour_left1, face.landmark.nose_contour_right1);
    var mouthMiddle = Center(face.landmark.mouth_lower_lip_top, face.landmark.mouth_upper_lip_bottom);
    var eyeBrowMiddle = Center(face.landmark.left_eyebrow_right_corner, face.landmark.right_eyebrow_left_corner);
    var eye_break_width = Distance(face.landmark.left_eye_left_corner, face.landmark.left_eye_right_corner) * 0.5 + Distance(face.landmark.right_eye_left_corner, face.landmark.right_eye_right_corner) * 0.5;
    var eyeBallMiddle = Center(face.landmark.left_eye_center, face.landmark.right_eye_center);
    var outsideCanthusDistance= Distance(landmark.left_eye_left_corner, landmark.right_eye_right_corner);
    var eyeBallDistance = Distance(face.landmark.left_eye_pupil, face.landmark.right_eye_pupil);
    var noseWidth = Distance(landmark.nose_left, landmark.nose_right);
    var faceWidth= Distance(face.landmark.contour_left2, face.landmark.contour_right2);
    var mouthWidth = Distance(landmark.mouth_left_corner, landmark.mouth_right_corner);
    //计算面容参数,先计算各参数
    sOutLine.eyeballDistance = eyeBallDistance; 
    sOutLine.facial_width = faceWidth;
    sOutLine.morphological_facial_height = Distance(face.landmark.contour_chin, noseStartPoint);
    sOutLine.physiognomic_upper_height = Distance(noseStartPoint, mouthMiddle);
    sOutLine.facial_middle_lower_height = Distance(eyeBrowMiddle, face.landmark.contour_chin);
    sOutLine.facial_middle_height = Distance(eyeBrowMiddle, face.landmark.nose_contour_lower_middle);
    sOutLine.facial_lower_height = Distance(face.landmark.nose_contour_lower_middle, face.landmark.contour_chin);
    
    sOutLine.bigonial_breadth = Distance(face.landmark.contour_left5, face.landmark.contour_right5);
    sOutLine.left_bigonial_angle = Angle(face.landmark.contour_right5, face.landmark.contour_right4, face.landmark.contour_right6);
    sOutLine.right_bigonial_angle= Angle(face.landmark.contour_left5, face.landmark.contour_left4, face.landmark.contour_left6);
    //计算面容指数，待所有参数计算完再计算指数，因为依赖的原因
    sOutLine.morphological_facial_index = sOutLine.morphological_facial_height / sOutLine.facial_width;
    sOutLine.bigonial_breadth_index = sOutLine.bigonial_breadth / sOutLine.facial_width;
    sOutLine.three_part_rate = sOutLine.facial_lower_height / sOutLine.facial_middle_height;//1.08为校正
    sOutLine.five_eye_rate =
        +0.1 * Math.abs(Distance(face.landmark.left_eye_left_corner, face.landmark.left_eye_right_corner) / Distance(face.landmark.left_eye_right_corner, face.landmark.right_eye_left_corner) - 1)
        + 0.1 * Math.abs(Distance(face.landmark.right_eye_left_corner, face.landmark.left_eye_right_corner) / Distance(face.landmark.right_eye_left_corner, face.landmark.right_eye_right_corner) - 1);
        
    sOutLine.facial_width_compair_middle_lower_height = sOutLine.facial_width / sOutLine.facial_middle_lower_height / 1.08;//1.08为校正
    // Point temp = new Point();
    // temp.x = eyeBallMiddle.x; temp.y = face.landmark.contour_chin.y;
    
    sOutLine.left_bigonial_compair_right_bigonial= 0.25*Math.abs(Angle(landmark.contour_chin,landmark.contour_left5,eyeBallMiddle)/Angle(landmark.contour_chin,eyeBallMiddle,landmark.contour_right5)-1)
        + 0.25 * Math.abs(Angle(landmark.contour_chin, landmark.contour_left3, eyeBallMiddle) / Angle(landmark.contour_chin, eyeBallMiddle, landmark.contour_right3) - 1)
        + 0.25 * Math.abs(Angle(landmark.contour_chin, landmark.contour_left7, eyeBallMiddle) / Angle(landmark.contour_chin, eyeBallMiddle, landmark.contour_right7) - 1)
        + 0.25 * Math.abs(Angle(landmark.contour_chin, landmark.contour_left9, eyeBallMiddle) / Angle(landmark.contour_chin, eyeBallMiddle, landmark.contour_right9) - 1);
    sOutLine.bigonial_angle = sOutLine.left_bigonial_angle * 0.5 + sOutLine.right_bigonial_angle * 0.5;
    sOutLine.chin_angle = Angle(landmark.contour_chin, landmark.contour_left9, landmark.contour_right9);
    //计算眉参数
    sEyebrow.eyebrow_distance = Distance(landmark.left_eyebrow_right_corner, landmark.right_eyebrow_left_corner);
    sEyebrow.left_eyebrow_angle = Angle(landmark.right_eyebrow_left_corner, landmark.right_eyebrow_right_corner, eyeBrowMiddle);
    sEyebrow.right_eyebrow_angle = Angle(landmark.left_eyebrow_right_corner, landmark.left_eyebrow_left_corner, eyeBrowMiddle);
    sEyebrow.left_eyebrow_nose_angle = Angle(landmark.right_eyebrow_left_corner, landmark.right_eyebrow_right_corner, landmark.nose_right);
    sEyebrow.right_eyebrow_nose_angle= Angle(landmark.left_eyebrow_right_corner, landmark.left_eyebrow_left_corner, landmark.nose_left);
    sEyebrow.left_eyebrowEnd_eyeEnd_noseWing = Angle(landmark.right_eye_right_corner, landmark.right_eyebrow_right_corner, landmark.nose_right);
    sEyebrow.right_eyebrowEnd_eyeEnd_noseWing = Angle(landmark.left_eye_left_corner, landmark.left_eyebrow_left_corner, landmark.nose_left);
    sEyebrow.eyebrow_compair_nose_distance = sEyebrow.eyebrow_distance /noseWidth ;
    sEyebrow.eyebrow_angle = 0.5 * sEyebrow.left_eyebrow_angle + 0.5 * sEyebrow.right_eyebrow_angle;
    //计算眼参数
    sEye.left_eye_break_hight = Distance(landmark.right_eye_top, landmark.right_eye_bottom);
    sEye.right_eye_break_hight = Distance(landmark.left_eye_bottom, landmark.left_eye_top);
    sEye.left_eye_break_width = Distance(landmark.right_eye_left_corner, landmark.right_eye_right_corner);
    sEye.right_eye_break_width = Distance(landmark.left_eye_right_corner, landmark.left_eye_left_corner);
    sEye.inner_canthus_distance = Distance(landmark.left_eye_right_corner, landmark.right_eye_left_corner);
    sEye.outside_canthus_distance = outsideCanthusDistance;
    sEye.left_inner_outside_anthus_angle = Angle(landmark.right_eye_left_corner, Center(landmark.right_eye_left_corner, landmark.left_eye_right_corner), landmark.right_eye_right_corner);
    sEye.right_inner_outside_anthus_angle = Angle(landmark.left_eye_right_corner, Center(landmark.right_eye_left_corner, landmark.left_eye_right_corner), landmark.left_eye_left_corner);
    sEye.inner_outside_anthus_angle = sEye.left_inner_outside_anthus_angle * 0.5 + sEye.right_inner_outside_anthus_angle * 0.5;
    sEye.eye_break_WH_rate = eye_break_width/ (0.5 * sEye.left_eye_break_hight + 0.5 * sEye.right_eye_break_hight);
    sEye.eye_break_compair_inner_canthus = eye_break_width / sEye.inner_canthus_distance;
    sEye.eye_face_index = sEye.outside_canthus_distance / Distance(landmark.contour_left1, landmark.contour_right1);
    //计算鼻参数
    sNose.nose_width = noseWidth;
    sNose.nose_body_width = Distance(landmark.nose_contour_left2, landmark.nose_contour_right2);
    sNose.nose_height = Distance(noseStartPoint, landmark.nose_contour_lower_middle);
    sNose.nose_width_compair_body = sNose.nose_width/sNose.nose_body_width;
    sNose.nose_width_compair_facial_width = sNose.nose_width / faceWidth;
    // Point noseMiddleLeft = new Point();
    // noseMiddleLeft.x = landmark.nose_contour_lower_middle.x - 50;
    // noseMiddleLeft.y = landmark.nose_contour_lower_middle.y;
    // Point noseMiddleRight = new Point();
    // noseMiddleRight.x = landmark.nose_contour_lower_middle.x + 50;
    // noseMiddleRight.y = landmark.nose_contour_lower_middle.y;
    
    sNose.nose_height_compair_facial_width = faceWidth/ sNose.nose_height;
    sNose.nose_index = sNose.nose_width / sNose.nose_height;
    sNose.nose_mouth_index = sNose.nose_width / mouthWidth;
    //计算口参数
    sMouth.mouth_width = mouthWidth;
    sMouth.mouth_chin_distance = Distance(mouthMiddle, landmark.contour_chin);
    sMouth.nose_mouth_distance = Distance(landmark.nose_contour_lower_middle, mouthMiddle);
    sMouth.nose_chin_distance = Distance(landmark.nose_contour_lower_middle, landmark.contour_chin);
    sMouth.lip_hight =Distance (Center(landmark.mouth_lower_lip_bottom, landmark.mouth_lower_lip_top), Center(landmark.mouth_upper_lip_bottom, landmark.mouth_upper_lip_top));
    sMouth.mouth_width_compair_mouth_chin = mouthWidth / sMouth.mouth_chin_distance;
    sMouth.nose_mouth_compair_nose_chin = sMouth.nose_mouth_distance / sMouth.nose_chin_distance;
    sMouth.mouth_width_compair_eyeBall_distance = mouthWidth / eyeBallDistance;
    sMouth.mouth_index = sMouth.lip_hight / mouthWidth;
    sMouth.lip_eye_index = mouthWidth / outsideCanthusDistance;
    sMouth.smile = face.attribute.smiling.value;

    sMouth.mouth_angle = 0.5 * Angle(mouthMiddle, landmark.mouth_left_corner, eyeBallMiddle) + 0.5 * Angle(mouthMiddle, landmark.mouth_right_corner, eyeBallMiddle);
    sMouth.lip_index = Distance(landmark.mouth_upper_lip_bottom, landmark.mouth_upper_lip_top)/ Distance(landmark.mouth_lower_lip_bottom, landmark.mouth_lower_lip_top) ;
    sMouth.delta_MBCMC = 0.819*(sMouth.mouth_width_compair_mouth_chin - 1.218)/1.218;
    sMouth.delta_NMCNC =0.382* (sMouth.nose_mouth_compair_nose_chin - 0.36) / 0.36;
    sMouth.delta_MBCED =0.618* (sMouth.mouth_width_compair_eyeBall_distance - 0.819)/0.819;
    sMouth.delta_MI =0.218* (sMouth.mouth_index - 0.182) / 0.182;
    sMouth.delta_LEI =0.382* (sMouth.lip_eye_index - 0.56)/0.56;
    sMouth.delta_LI = 0.382*(sMouth.lip_index - 0.618) / 0.618;
    sMouth.delta_MA =1.5* (sMouth.mouth_angle - 82) / 82;
    sMouth.delta_S = 0.1 *( (0.6+0.4* sMouth.smile/100)-1) ;
   

    //计算轮廓部分偏差
    sOutLine.delta_BBI = 1.5*((sOutLine.bigonial_breadth_index - 0.819)/0.819) ;//两颌间角距离指数与标准差值
    sOutLine.delta_TPR = (sOutLine.three_part_rate - 0.95)/0.95;//三庭指标与标准值差距
    sOutLine.delta_FER = sOutLine.five_eye_rate;
    sOutLine.delta_FWCMLH = sOutLine.facial_width_compair_middle_lower_height - 1;
    sOutLine.delta_LBCRB =2* sOutLine.left_bigonial_compair_right_bigonial ;
    sOutLine.delta_BA = 2*(168 - sOutLine.bigonial_angle) / 168;
    sOutLine.delta_CA =  (sOutLine.chin_angle-146) / 146;

    //计算眉偏差
    sEyebrow.delta_LEEN =(sEyebrow.left_eyebrowEnd_eyeEnd_noseWing - 180) / 180;//5为校正
    sEyebrow.delta_REEN =  (sEyebrow.right_eyebrowEnd_eyeEnd_noseWing - 180) / 180;
    sEyebrow.delta_LENA = 0.5 * (sEyebrow.left_eyebrow_nose_angle - 90) / 90;
    sEyebrow.delta_RENA = 0.5 * (sEyebrow.right_eyebrow_nose_angle - 90) / 90;
    sEyebrow.delta_ECND = 0.2 * (sEyebrow.eyebrow_compair_nose_distance - 0.9)/0.9;
   
    sEyebrow.delta_EA = 6.18 * (sEyebrow.eyebrow_angle - 180) / 180;

    //计算眼部分偏差
    sEye.delta_EBWR = (sEye.eye_break_WH_rate - 2.618) / 2.618;
    sEye.delta_EBCIC = 0.5*(sEye.eye_break_compair_inner_canthus - 0.9)/0.9;
    sEye.delta_IACO =2* (sEye.inner_outside_anthus_angle - 170) / 170;
    sEye.delta_EFI =0.5* (sEye.eye_face_index - 0.618)/0.618;

    //计算鼻偏差
    sNose.delta_NWWCB = 0.618 * (sNose.nose_width_compair_body - 1.318) / 1.318;
    sNose.delta_NWCFW = 0.618 * (sNose.nose_width_compair_facial_width - 0.232) / 0.232;
   
    sNose.delta_NHCFW = (sNose.nose_height_compair_facial_width-3.18 ) / 3.18;
    sNose.delta_NI = 0.618 * (sNose.nose_index - 0.732) / 0.732;
    sNose.delta_NMI = 0.618 * (sNose.nose_mouth_index - 0.68) / 0.68;
   
    Calculate();
}

function Adjust_Delta(delta) {
    if (delta < -0.3) return 0.5 * Math.abs(delta / 0.1);
    if (delta < -0.1) return 0.2 * Math.abs(delta / 0.1);
    if (delta < 0) return 0.1*Math.abs(delta / 0.1);
    if (delta > 0.15) return 1.5;
    return (delta / 0.1);
}

function Adjust_Delta_eyebrow(delta) {
    if (delta < -0.3) {return 0.5 * Math.abs(delta / 0.1)};
    if (delta < -0.1) {return 0.2 * Math.abs(delta / 0.1)};
    if (delta < 0) {return 0.1 * Math.abs(delta / 0.1)};
    //if (delta > .1) return 1;
    return delta / 0.1;
}

function math_round(num, fix) {
    num = Number(num);
    fix = Number(fix);
    var _num = num.toFixed(fix);
    return Number(_num)
}

function Calculate() {

    //《bang 2017.02.20 改，
    sOutLine.delta_BBI = Math.abs(sOutLine.delta_BBI) * Adjust_Delta(sOutLine.delta_BBI);
    sOutLine.delta_TPR = Math.abs(sOutLine.delta_TPR) * Adjust_Delta(sOutLine.delta_TPR);
    sOutLine.delta_FER = Math.abs(sOutLine.delta_FER) * (Adjust_Delta(sOutLine.delta_FER));
    sOutLine.delta_FWCMLH = Math.abs(sOutLine.delta_FWCMLH) * Adjust_Delta(sOutLine.delta_FWCMLH);
    sOutLine.delta_LBCRB = Math.abs(sOutLine.delta_LBCRB) * Adjust_Delta(Math.abs(sOutLine.delta_LBCRB));
    sOutLine.delta_BA = Math.abs(sOutLine.delta_BA) * Adjust_Delta(Math.abs(sOutLine.delta_BA));
    sOutLine.delta_CA = Math.abs(sOutLine.delta_CA) * Adjust_Delta(sOutLine.delta_CA);

    outLineScore = 100 * (1 - 0.9 * (
           sOutLine.delta_BBI
           + sOutLine.delta_TPR
           + sOutLine.delta_FER
           + sOutLine.delta_FWCMLH
           + sOutLine.delta_LBCRB
           + sOutLine.delta_BA
           + sOutLine.delta_CA));
    if (outLineScore < 60) {outLineScore = 60};
    if (outLineScore > 99.5) {outLineScore = 99.5};

    eyebrowScore = 100 * (
           1 - 0.9 * (Math.abs(sEyebrow.delta_LEEN) * Adjust_Delta(Math.abs(sEyebrow.delta_LEEN))

            + Math.abs(sEyebrow.delta_REEN) * Adjust_Delta(Math.abs(sEyebrow.delta_REEN))
           + Math.abs(sEyebrow.delta_LENA) * Adjust_Delta(Math.abs(sEyebrow.delta_LENA))

           + Math.abs(sEyebrow.delta_RENA) * Adjust_Delta(Math.abs(sEyebrow.delta_RENA))
           + Math.abs(sEyebrow.delta_ECND) * Adjust_Delta(Math.abs(sEyebrow.delta_ECND))
           
           + Math.abs(sEyebrow.delta_EA) * Adjust_Delta_eyebrow(sEyebrow.delta_EA)));
    
    if (eyebrowScore < 60) {eyebrowScore = 60};
    if (eyebrowScore > 99.5) {eyebrowScore = 99.5};

    eyeScore = 100 * (1 - 0.9 * (Math.abs(sEye.delta_EBWR) * Adjust_Delta(sEye.delta_EBWR)
           + Math.abs(sEye.delta_EBCIC) * Adjust_Delta(Math.abs(sEye.delta_EBCIC))
           + Math.abs(sEye.delta_IACO) * Adjust_Delta_eyebrow(Math.abs(sEye.delta_IACO))
           + Math.abs(sEye.delta_EFI) * Adjust_Delta(Math.abs(sEye.delta_EFI))));
    if (eyeScore < 60) {eyeScore = 60};
    if (eyeScore > 99.5) {eyeScore = 99.5};

    noseScore = 100 * (1 - 0.9 * (Math.abs(sNose.delta_NWWCB) * Adjust_Delta(sNose.delta_NWWCB)
           + Math.abs(sNose.delta_NWCFW) * Adjust_Delta(sNose.delta_NWCFW)
           + Math.abs(sNose.delta_NHCFW) * Adjust_Delta(sNose.delta_NHCFW)
           + Math.abs(sNose.delta_NI) * Adjust_Delta(sNose.delta_NI)
           + Math.abs(sNose.delta_NMI) * Adjust_Delta(Math.abs(sNose.delta_NMI))));
    if (noseScore < 60) {noseScore = 60};
    if (noseScore > 99.5) {noseScore = 99.5};
    

    mouthScore = 100 * (1 - 0.9 * (Math.abs(sMouth.delta_MBCMC) * Adjust_Delta(sMouth.delta_MBCMC)
           + Math.abs(sMouth.delta_NMCNC) * Adjust_Delta(sMouth.delta_NMCNC)
           + Math.abs(sMouth.delta_MBCED) * Adjust_Delta(Math.abs(sMouth.delta_MBCED))
           + Math.abs(sMouth.delta_MI) * Adjust_Delta(Math.abs(sMouth.delta_MI))
           + Math.abs(sMouth.delta_LEI) * Adjust_Delta(sMouth.delta_LEI)
           + Math.abs(sMouth.delta_LI) * Adjust_Delta(sMouth.delta_LI)
           + Math.abs(sMouth.delta_MA) * Adjust_Delta(sMouth.delta_MA)
           +  Math.abs(sMouth.delta_S)));

    if (mouthScore < 60) {mouthScore = 60};
    if (mouthScore > 99.5) {mouthScore = 99.5};
    looksTotalScore = (outLineScore * 1.5 + eyebrowScore * 0.8 + eyeScore + noseScore + mouthScore * 0.8) / (1.5 + 0.8 + 1 + 1 + 0.8);
    looksTotalScore = math_round(looksTotalScore, 1);

    //随机添加一些小数，不要全是整数，全是整数会很假
    var b = {};
    for (var i = 0; i < 5; i++) {
        b[i] = parseInt(5*Math.random());
    }

    sKanXiang.outLine = 75 + 15 * (outLineScore-60) / 40 +b[0];
    sKanXiang.eyebrow = 75 + 15 * (eyebrowScore-60) / 40 + b[1];
    sKanXiang.eye = 75 + 15 * (eyeScore - 60) / 40 + b[2];
    sKanXiang.nose = 75 + 15 * (noseScore - 60) / 40 + b[3];
    sKanXiang.mouth = 75 + 15 *( mouthScore - 60) / 40 + b[4];
    kanXiangScore = (1.5*sKanXiang.outLine + sKanXiang.eyebrow + sKanXiang.eye + sKanXiang.nose + sKanXiang.mouth) / 5.5;



    outLineScore = math_round(outLineScore, 1);//取一位小数
    eyebrowScore= math_round(eyebrowScore, 1);
    eyeScore= math_round(eyeScore, 1);
    noseScore= math_round(noseScore, 1);
    mouthScore= math_round(mouthScore, 1);
    kanXiangScore= math_round(kanXiangScore, 1);
    //2017/1/17修改，把所有比值变成分数

    testValue.totleScore = looksTotalScore;

    testValue.sTotle_Scores = {};
    testValue.sTotle_Scores.outLineScore = outLineScore;
    testValue.sTotle_Scores.eyebrowScore = eyebrowScore;
    testValue.sTotle_Scores.eyeScore = eyeScore;
    testValue.sTotle_Scores.noseScore = noseScore;
    testValue.sTotle_Scores.mouthScore = mouthScore;
    testValue.sTotle_Scores.kanXiangScore = kanXiangScore;

    
    testValue.sOutLine_Scores = {};
    testValue.sOutLine_Scores.delta_BA = sOutLine.delta_BA;
    testValue.sOutLine_Scores.delta_BBI = sOutLine.delta_BBI;
    testValue.sOutLine_Scores.delta_CA = sOutLine.delta_CA;
    testValue.sOutLine_Scores.delta_FER = sOutLine.delta_FER;
    testValue.sOutLine_Scores.delta_FWCMLH = sOutLine.delta_FWCMLH;
    testValue.sOutLine_Scores.delta_LBCRB = sOutLine.delta_LBCRB;
    testValue.sOutLine_Scores.delta_TPR = sOutLine.delta_TPR;

    testValue.sEyebrow_Scores = {};
    testValue.sEyebrow_Scores.delta_EA = sEyebrow.delta_EA;
    testValue.sEyebrow_Scores.delta_ECND = sEyebrow.delta_ECND;
    testValue.sEyebrow_Scores.delta_LEEN = sEyebrow.delta_LEEN;
    testValue.sEyebrow_Scores.delta_LENA = sEyebrow.delta_LENA;
    testValue.sEyebrow_Scores.delta_REEN = sEyebrow.delta_REEN;
    testValue.sEyebrow_Scores.delta_RENA = sEyebrow.delta_RENA;

    testValue.sEye_Scores = {};
    testValue.sEye_Scores.delta_EBCIC = sEye.delta_EBCIC;
    testValue.sEye_Scores.delta_EBWR = sEye.delta_EBWR;
    testValue.sEye_Scores.delta_EFI = sEye.delta_EFI;
    testValue.sEye_Scores.delta_IACO = sEye.delta_IACO;

    testValue.sNose_Scores = {};
    testValue.sNose_Scores.delta_NHCFW = sNose.delta_NHCFW;
    testValue.sNose_Scores.delta_NI = sNose.delta_NI;
    testValue.sNose_Scores.delta_NMI = sNose.delta_NMI;
    testValue.sNose_Scores.delta_NWCFW = sNose.delta_NWCFW;
    testValue.sNose_Scores.delta_NWWCB = sNose.delta_NWWCB;

    testValue.sMouth_Scores = {};
    testValue.sMouth_Scores.delta_LEI = sMouth.delta_LEI;
    testValue.sMouth_Scores.delta_LI = sMouth.delta_LI;
    
    testValue.sMouth_Scores.delta_MBCED = sMouth.delta_MBCED;
    testValue.sMouth_Scores.delta_MBCMC = sMouth.delta_MBCMC;
    testValue.sMouth_Scores.delta_MI = sMouth.delta_MI;
    testValue.sMouth_Scores.delta_NMCNC = sMouth.delta_NMCNC;
    testValue.sMouth_Scores.delta_S = sMouth.delta_S;

    testValue.sKanXiang_Scores = sKanXiang;

    //2017/1/19修改>>>
    //2017/2/27 修改各种分数，使其在子项指标的分数最大最小值内<<<
    CheckTestValue();

    //2017/2/27 修改各种分数，使其在子项指标的分数最大最小值内<<<
}

function CheckTestValue() {

    let fields = Object.keys(testValue);

    for (let i = 0; i < fields.length; i++) {

        let o = testValue[fields[i]];
        if (fields[i] === 'totleScore') {
            let value = o > 99 ? 99 : o;
            value = o < 65 ? 65 : o;
            value = math_round(value + Number(Math.random().toFixed(2)), 2);
            testValue[fields[i]] = value;
        } else {

            let other_fields = testValue[fields[i]];
            let childers = Object.keys(other_fields);
            let average = 0;let maxLoss=0;
            for (let j = 0; j < childers.length; j++) {
                if(j === 6) {
                    var eeeeeee= childers.length
                }

                let child_val = other_fields[childers[j]];
                if (child_val){
                    //表示数据为偏差，还未调整为分数
                    if (child_val < 1 || child_val === 1) {
                        child_val = 100 * (1 -Math.abs( child_val));
                        average += (child_val / childers.length);
                    }
                    child_val = child_val > 99 ? 99 : child_val;
                    child_val = child_val < 65 ? 65 : child_val;
                    child_val = math_round(child_val + Number(Math.random().toFixed(2)), 2);

                    if(childers[j] !== 'delta_S') {
                        if((100 - child_val ) > maxLoss ) {maxLoss = 100 - child_val};
                    }
                    testValue[fields[i]][childers[j]] = child_val;
                }
            }

            //又是矫正，让分值处于子指标之间
            if (fields[i] !== 'sTotle_Scores' && fields[i] !== 'sKanXiang_Scores') {
                let sCore_key = {sEye_Scores: 'eyeScore',sEyebrow_Scores: 'eyebrowScore',sKanXiang_Scores: 'kanXiangScore',sMouth_Scores: 'mouthScore', sNose_Scores: 'noseScore', sOutLine_Scores: 'outLineScore'}
                let obj_sTotalScore = testValue['sTotle_Scores'];
                let sCore_value = obj_sTotalScore[sCore_key[fields[i]]];//轮廓等分数各项与计算它的子项指标结构体相差脚标2
                let gap_score = average - sCore_value;

                for (let K = 0; K < childers.length; K++)
                {
                    let other_val = o[childers[K]];
                    if (other_val)
                    {
                        other_val = other_val - gap_score * (100 - other_val) / maxLoss;
                        other_val = other_val < 64 ? 64  : other_val;
                        other_val = other_val > 98 ? 98 : other_val;
                        other_val = math_round(other_val + Number(Math.random().toFixed(2)), 2);

                        testValue[fields[i]][childers[K]] = other_val;
                    }

                }
            }
        }

    }
}

function Angle(cen, first, second)
{
    const M_PI = 3.1415926535897;

    let ma_x = first.x - cen.x;
    var ma_y = first.y - cen.y;
    var mb_x = second.x - cen.x;
    var mb_y = second.y - cen.y;
    var v1 = (ma_x * mb_x) + (ma_y * mb_y);
    var ma_val = Math.sqrt(ma_x * ma_x + ma_y * ma_y);
    var mb_val = Math.sqrt(mb_x * mb_x + mb_y * mb_y);
    var cosM = v1 / (ma_val * mb_val);
    var angleAMB = Math.acos(cosM) * 180 / M_PI;

    return angleAMB;
}

function Center(p1, p2) {
    var p = {};
    p.x = (p1.x - p2.x) / 2 + p2.x;
    p.y = (p1.y - p2.y) / 2 + p2.y;
    return p;
}

function Distance(p1, p2) {
    var _distance = Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2.0) + Math.pow(Math.abs(p1.y - p2.y), 2.0));
    return _distance
}


_looks.getData = function(face, width, height) {
    Init(face, width, height);
    looks.LooksTotalScore = testValue.totleScore;//面容总分
    looks.SKanXiang = sKanXiang;//看相参数
    looks.KanXiangScore = testValue.sTotle_Scores.kanXiangScore;//看相分数
    looks.SOutLine = sOutLine;//轮廓参数
    looks.OutLineScore = testValue.sTotle_Scores.outLineScore;//轮廓评分
    looks.SEyebrow = sEyebrow;//眉参数
    looks.EyebrowScore = testValue.sTotle_Scores.eyebrowScore;//眉评分
    looks.SEye = sEye;//眼参数
    looks.EyeScore = testValue.sTotle_Scores.eyeScore;//眼评分
    looks.SNose = sNose;//鼻参数
    looks.NoseScore = testValue.sTotle_Scores.noseScore;//鼻评分
    looks.SMouth = sMouth;//口参数
    looks.MouthScore = testValue.sTotle_Scores.mouthScore;//口评分
    looks.TestValue = testValue;//计算结果
    return looks;
}
module.exports = _looks

// var testdata = function(face, width, height) {
//     Init(face, width, height);
//     looks.LooksTotalScore = testValue.totleScore;//面容总分
//     looks.KanXiang = sKanXiang;//看相参数
//     looks.KanXiangScore = testValue.sTotle_Scores.kanXiangScore;//看相分数
//     looks.OutLine = sOutLine;//轮廓参数
//     looks.OutLineScore = testValue.sTotle_Scores.outLineScore;//轮廓评分
//     looks.Eyebrow = sEyebrow;//眉参数
//     looks.EyebrowScore = testValue.sTotle_Scores.eyebrowScore;//眉评分
//     looks.Eye = sEye;//眼参数
//     looks.EyeScore = testValue.sTotle_Scores.eyeScore;//眼评分
//     looks.Nose = sNose;//鼻参数
//     looks.NoseScore = testValue.sTotle_Scores.noseScore;//鼻评分
//     looks.Mouth = sMouth;//口参数
//     looks.MouthScore = testValue.sTotle_Scores.mouthScore;//口评分
//     looks.TestValue = testValue;//计算结果
// }

// testdata(testjson.face, testjson.w, testjson.h);

// console.log(looks)













