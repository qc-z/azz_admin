using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FaceppSDK;
using System.Reflection;
using System.Diagnostics;

/// <summary>
/// 面容数据封装类
/// </summary>
namespace LooksAnalyzing
{
   public class TestValue
    {

        public double totleScore;//总分
        public Totle_Scores sTotle_Scores;//总体各指标评分结果
        public OutLine_Scores sOutLine_Scores;//轮廓各指标评分结果
        public Eyebrow_Scores sEyebrow_Scores;//眉部各指标评分结果
        public Eye_Scores sEye_Scores;//眼部各指标评分结果
        public Nose_Scores sNose_Scores;//鼻部各指标评分结果
        public Mouth_Scores sMouth_Scores;//口唇各指标评分结果
        public KanXiang_Scores sKanXiang_Scores;//看相各指标评分结果
        public struct Totle_Scores
        {
            public double outLineScore;//轮廓评分
            public double eyebrowScore;//眉部评分
            public double eyeScore;//眼部评分
            public double noseScore;//鼻部评分
            public double mouthScore;//口唇评分
            public double kanXiangScore;//看相分数

        }
        /// <summary>
        /// 轮廓评分
        /// </summary>
        public struct OutLine_Scores
        {
            //各指标与标志值偏差
            public double delta_BBI;//两颌间角距离指数与标准差值 颧下颌宽度指数
            public double delta_TPR;//三庭指标与标准值差距
            public double delta_FER;//五眼
            public double delta_FWCMLH;//面宽/中下面
            public double delta_LBCRB;//对称性
            public double delta_BA;//颧颌角
            public double delta_CA;//下巴角度与标准差值 下巴形状
        }
        /// <summary>
        /// 眉评分
        /// </summary>
        public struct Eyebrow_Scores
        {

            public double delta_LENA;// 眉与鼻翼连线和眉的夹角标准差值 左眉对称性
            public double delta_RENA;//眉与鼻翼连线和眉的夹角标准差值  右眉对称性
            public double delta_LEEN;//眉尾眼外角鼻翼形成的夹角与标准差值  左眉眼鼻连线
            public double delta_REEN;//眉尾眼外角鼻翼形成的夹角与标准差值  右眉眼鼻连线
            public double delta_ECND;//眉间距与鼻翼宽比较  眉间距
            public double delta_EA;//左右眉角度平均值与标准值差值  眉水平角
        }
        /// <summary>
        /// 眼评分
        /// </summary>
        public struct Eye_Scores
        {


            public double delta_EBWR;//眼裂宽高比与标准比较 
            public double delta_EBCIC;//眼宽/内眦间距之比与标准比较  
            public double delta_IACO;//内眦-外眦角与标准比较
            public double delta_EFI;//目面指数 与标准比较

        }
        /// <summary>
        /// 鼻评分
        /// </summary>
        public struct Nose_Scores
        {


            public double delta_NWWCB;//鼻翼体宽之比与标准差值  鼻形状
            public double delta_NWCFW;//鼻面宽之比与标准之差    鼻宽/面宽
                                     // public double delta_NWA;//鼻翼角与标准之差
            public double delta_NHCFW;//鼻长面宽之比与标准之差  鼻长/面宽
            public double delta_NI;//鼻指数与标准之差
            public double delta_NMI;//鼻唇指数
        }
        /// <summary>
        /// 口评分
        /// </summary>
        public struct Mouth_Scores
        {

            public double delta_MBCMC;//口宽/颏高与标准差值
            public double delta_NMCNC;//口鼻距离 ： 颏鼻距离与标准差值
            public double delta_MBCED;//口宽/瞳距与标准差值
            public double delta_MI;//口指数与标准差值
            public double delta_LEI;//唇目指数 与标准差值
            public double delta_LI;//唇指数 与标准差值
            public double delta_S;//微笑指数与标准差值
        }
        /// <summary>
        /// 看相的评分封装在这里
        /// </summary>
        public struct KanXiang_Scores
        {
            public double outLine;//轮廓相
            public double eyebrow;//眉相
            public double eye;//眼相
            public double nose;//鼻相
            public double mouth;//口唇相

        }


    }

    public class Looks :LooksData
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="face">face++特征点</param>
        /// <param name="width">图片宽</param>
        /// <param name="height">图片高</param>
        public Looks(Face face,int width,int height)
        {
            Init(face, width, height);
            
        }

        //公共参数
        #region
        private Point noseStartPoint;//鼻根点
        private Point mouthMiddle;//口裂点
        private double mouthWidth;//口宽
        private Point eyeBrowMiddle;//眉心点
        private double eye_break_width;//眼裂宽
        private Point eyeBallMiddle;//两瞳孔中心点
        private double eyeBallDistance;//瞳距
        private double noseWidth;//鼻翼宽
        private double faceWidth;//脸宽
        private double outsideCanthusDistance;//外眦间距
        #endregion

        /// <summary>
        /// 初始化对象
        /// </summary>
        /// <param name="face"></param>
        /// <param name="width"></param>
        /// <param name="height"></param>
        private void Init(Face face, int width, int height) {

            if (null == face || null ==face.landmark || face.landmark.contour_chin.x==0 || face.landmark.nose_contour_lower_middle.x==0) throw new Exception("face 数据为空！");
            this.face = face;
            this.landmark = face.landmark;
            this.ima_width = width;
            this.ima_height = height;
            
            //计算公共参数
            #region
            noseStartPoint = Center(face.landmark.nose_contour_left1, face.landmark.nose_contour_right1);
            mouthMiddle = Center(face.landmark.mouth_lower_lip_top, face.landmark.mouth_upper_lip_bottom);
            eyeBrowMiddle = Center(face.landmark.left_eyebrow_right_corner, face.landmark.right_eyebrow_left_corner);
            eye_break_width = Distance(face.landmark.left_eye_left_corner, face.landmark.left_eye_right_corner) * 0.5f + Distance(face.landmark.right_eye_left_corner, face.landmark.right_eye_right_corner) * 0.5f;
            eyeBallMiddle = Center(face.landmark.left_eye_center, face.landmark.right_eye_center);
            outsideCanthusDistance= Distance(landmark.left_eye_left_corner, landmark.right_eye_right_corner);
            eyeBallDistance = Distance(face.landmark.left_eye_pupil, face.landmark.right_eye_pupil);
            noseWidth = Distance(landmark.nose_left, landmark.nose_right);
            faceWidth= (double)Distance(face.landmark.contour_left2, face.landmark.contour_right2);
            mouthWidth = Distance(landmark.mouth_left_corner, landmark.mouth_right_corner);
            #endregion
            //计算面容参数,先计算各参数
            #region
            sOutLine.eyeballDistance = eyeBallDistance; 
            sOutLine.facial_width = faceWidth;
            sOutLine.morphological_facial_height = (double)Distance(face.landmark.contour_chin, noseStartPoint);
            sOutLine.physiognomic_upper_height = (double)Distance(noseStartPoint, mouthMiddle);
            sOutLine.facial_middle_lower_height = (double)Distance(eyeBrowMiddle, face.landmark.contour_chin);
            sOutLine.facial_middle_height = (double)Distance(eyeBrowMiddle, face.landmark.nose_contour_lower_middle);
            sOutLine.facial_lower_height = (double)Distance(face.landmark.nose_contour_lower_middle, face.landmark.contour_chin);
            
            sOutLine.bigonial_breadth = (double)Distance(face.landmark.contour_left5, face.landmark.contour_right5);
            sOutLine.left_bigonial_angle = (double)Angle(face.landmark.contour_right5, face.landmark.contour_right4, face.landmark.contour_right6);
            sOutLine.right_bigonial_angle= (double)Angle(face.landmark.contour_left5, face.landmark.contour_left4, face.landmark.contour_left6);
            //计算面容指数，待所有参数计算完再计算指数，因为依赖的原因
            sOutLine.morphological_facial_index = sOutLine.morphological_facial_height / sOutLine.facial_width;
            sOutLine.bigonial_breadth_index = sOutLine.bigonial_breadth / sOutLine.facial_width;
            sOutLine.three_part_rate = sOutLine.facial_lower_height / sOutLine.facial_middle_height;//1.08为校正
            sOutLine.five_eye_rate =
                +.1 * Math.Abs(Distance(face.landmark.left_eye_left_corner, face.landmark.left_eye_right_corner) / Distance(face.landmark.left_eye_right_corner, face.landmark.right_eye_left_corner) - 1)
                + .1 * Math.Abs(Distance(face.landmark.right_eye_left_corner, face.landmark.left_eye_right_corner) / Distance(face.landmark.right_eye_left_corner, face.landmark.right_eye_right_corner) - 1);
                
            sOutLine.facial_width_compair_middle_lower_height = (double)(sOutLine.facial_width / sOutLine.facial_middle_lower_height / 1.08);//1.08为校正
            Point temp = new Point();
            temp.x = eyeBallMiddle.x; temp.y = face.landmark.contour_chin.y;
            
            sOutLine.left_bigonial_compair_right_bigonial=.25*Math.Abs(Angle(landmark.contour_chin,landmark.contour_left5,eyeBallMiddle)/Angle(landmark.contour_chin,eyeBallMiddle,landmark.contour_right5)-1)
                + .25 * Math.Abs(Angle(landmark.contour_chin, landmark.contour_left3, eyeBallMiddle) / Angle(landmark.contour_chin, eyeBallMiddle, landmark.contour_right3) - 1)
                +.25 * Math.Abs(Angle(landmark.contour_chin, landmark.contour_left7, eyeBallMiddle) / Angle(landmark.contour_chin, eyeBallMiddle, landmark.contour_right7) - 1)
                +.25 * Math.Abs(Angle(landmark.contour_chin, landmark.contour_left9, eyeBallMiddle) / Angle(landmark.contour_chin, eyeBallMiddle, landmark.contour_right9) - 1);
            sOutLine.bigonial_angle = (double)(sOutLine.left_bigonial_angle * 0.5 + sOutLine.right_bigonial_angle * 0.5);
            sOutLine.chin_angle = Angle(AnalyzeTool.FacePoit_To_SystemPoint( landmark.contour_chin,ima_width,ima_height), AnalyzeTool.FacePoit_To_SystemPoint(landmark.contour_left9,ima_width,ima_height), AnalyzeTool.FacePoit_To_SystemPoint(landmark.contour_right9,ima_width,ima_height));
            #endregion
            //计算眉参数
            #region
            sEyebrow.eyebrow_distance = (double)Distance(landmark.left_eyebrow_right_corner, landmark.right_eyebrow_left_corner);
            sEyebrow.left_eyebrow_angle = Angle(landmark.right_eyebrow_left_corner, landmark.right_eyebrow_right_corner, eyeBrowMiddle);
            sEyebrow.right_eyebrow_angle = Angle(landmark.left_eyebrow_right_corner, landmark.left_eyebrow_left_corner, eyeBrowMiddle);
            sEyebrow.left_eyebrow_nose_angle = (double)Angle(landmark.right_eyebrow_left_corner, landmark.right_eyebrow_right_corner, landmark.nose_right);
            sEyebrow.right_eyebrow_nose_angle= (double)Angle(landmark.left_eyebrow_right_corner, landmark.left_eyebrow_left_corner, landmark.nose_left);
            sEyebrow.left_eyebrowEnd_eyeEnd_noseWing = (double)Angle(landmark.right_eye_right_corner, landmark.right_eyebrow_right_corner, landmark.nose_right);
            sEyebrow.right_eyebrowEnd_eyeEnd_noseWing = (double)Angle(landmark.left_eye_left_corner, landmark.left_eyebrow_left_corner, landmark.nose_left);
            sEyebrow.eyebrow_compair_nose_distance = sEyebrow.eyebrow_distance /noseWidth ;
            sEyebrow.eyebrow_angle = .5f * sEyebrow.left_eyebrow_angle + .5f * sEyebrow.right_eyebrow_angle;
            #endregion
            //计算眼参数
            #region
            sEye.left_eye_break_hight = Distance(landmark.right_eye_top, landmark.right_eye_bottom);
            sEye.right_eye_break_hight = Distance(landmark.left_eye_bottom, landmark.left_eye_top);
            sEye.left_eye_break_width = Distance(landmark.right_eye_left_corner, landmark.right_eye_right_corner);
            sEye.right_eye_break_width = Distance(landmark.left_eye_right_corner, landmark.left_eye_left_corner);
            sEye.inner_canthus_distance = Distance(landmark.left_eye_right_corner, landmark.right_eye_left_corner);
            sEye.outside_canthus_distance = outsideCanthusDistance;
            sEye.left_inner_outside_anthus_angle = Angle(landmark.right_eye_left_corner, Center(landmark.right_eye_left_corner, landmark.left_eye_right_corner), landmark.right_eye_right_corner);
            sEye.right_inner_outside_anthus_angle = Angle(landmark.left_eye_right_corner, Center(landmark.right_eye_left_corner, landmark.left_eye_right_corner), landmark.left_eye_left_corner);
            sEye.inner_outside_anthus_angle = sEye.left_inner_outside_anthus_angle * .5f + sEye.right_inner_outside_anthus_angle * .5f;
            sEye.eye_break_WH_rate = eye_break_width/ (.5f * sEye.left_eye_break_hight + .5f * sEye.right_eye_break_hight);
            sEye.eye_break_compair_inner_canthus = eye_break_width / sEye.inner_canthus_distance;
            sEye.eye_face_index = sEye.outside_canthus_distance / Distance(landmark.contour_left1, landmark.contour_right1);
            #endregion
            //计算鼻参数
            #region
            sNose.nose_width = noseWidth;
            sNose.nose_body_width = Distance(landmark.nose_contour_left2, landmark.nose_contour_right2);
            sNose.nose_height = Distance(noseStartPoint, landmark.nose_contour_lower_middle);
            sNose.nose_width_compair_body = sNose.nose_width/sNose.nose_body_width ;
            sNose.nose_width_compair_facial_width = sNose.nose_width / faceWidth;
            Point noseMiddleLeft = new Point();
            noseMiddleLeft.x = landmark.nose_contour_lower_middle.x - 50;
            noseMiddleLeft.y = landmark.nose_contour_lower_middle.y;
            Point noseMiddleRight = new Point();
            noseMiddleRight.x = landmark.nose_contour_lower_middle.x + 50;
            noseMiddleRight.y = landmark.nose_contour_lower_middle.y;
            
            sNose.nose_height_compair_facial_width = faceWidth/ sNose.nose_height  ;
            sNose.nose_index = sNose.nose_width / sNose.nose_height;
            sNose.nose_mouth_index = sNose.nose_width / mouthWidth;
            #endregion
            //计算口参数
            #region
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
            sMouth.smile =(double) face.attribute.smiling.value;

            sMouth.mouth_angle = .5f * Angle(mouthMiddle, landmark.mouth_left_corner, eyeBallMiddle) + .5f * Angle(mouthMiddle, landmark.mouth_right_corner, eyeBallMiddle);
            sMouth.lip_index = Distance(landmark.mouth_upper_lip_bottom, landmark.mouth_upper_lip_top)/ Distance(landmark.mouth_lower_lip_bottom, landmark.mouth_lower_lip_top) ;
            sMouth.delta_MBCMC = .819f*(sMouth.mouth_width_compair_mouth_chin - 1.218f)/1.218f;
            sMouth.delta_NMCNC =.382f* (sMouth.nose_mouth_compair_nose_chin - .36f) / .36f;
            sMouth.delta_MBCED =.618f* (sMouth.mouth_width_compair_eyeBall_distance - .819f)/.819f;
            sMouth.delta_MI =.218f* (sMouth.mouth_index - .182f) / .182f;
            sMouth.delta_LEI =.382f* (sMouth.lip_eye_index - .56f)/.56f;
            sMouth.delta_LI = .382f*(sMouth.lip_index - .618f) / .618f;
            sMouth.delta_MA =1.5f* (sMouth.mouth_angle - 82) / 82;
            sMouth.delta_S = .1f *( (.6f+.4f* sMouth.smile/100)-1) ;
           

            #endregion
            //计算轮廓部分偏差
            #region
            sOutLine.delta_BBI = 1.5*((sOutLine.bigonial_breadth_index - 0.819)/0.819) ;//两颌间角距离指数与标准差值
            sOutLine.delta_TPR = (double)((sOutLine.three_part_rate - 0.95)/0.95);//三庭指标与标准值差距
            sOutLine.delta_FER = sOutLine.five_eye_rate  ;
            sOutLine.delta_FWCMLH = sOutLine.facial_width_compair_middle_lower_height - 1;
            sOutLine.delta_LBCRB =2* sOutLine.left_bigonial_compair_right_bigonial ;
            sOutLine.delta_BA = 2*(168 - sOutLine.bigonial_angle) / 168;
            sOutLine.delta_CA =  ( sOutLine.chin_angle-146) / 146;

            #endregion
            //计算眉偏差
            #region
            sEyebrow.delta_LEEN =(sEyebrow.left_eyebrowEnd_eyeEnd_noseWing - 180) / 180;//5为校正
            sEyebrow.delta_REEN =  (sEyebrow.right_eyebrowEnd_eyeEnd_noseWing - 180) / 180;
            sEyebrow.delta_LENA = .5F * (sEyebrow.left_eyebrow_nose_angle - 90) / 90;
            sEyebrow.delta_RENA = .5f * (sEyebrow.right_eyebrow_nose_angle - 90) / 90;
            sEyebrow.delta_ECND = .2f * (sEyebrow.eyebrow_compair_nose_distance - .9f)/.9f ;
           
            sEyebrow.delta_EA = 6.18f * (sEyebrow.eyebrow_angle - 180) / 180;

            #endregion
            //计算眼部分偏差
            #region
            sEye.delta_EBWR = (sEye.eye_break_WH_rate - 2.618f) / 2.618f;
            sEye.delta_EBCIC = .5F*(sEye.eye_break_compair_inner_canthus - .9F)/.9F;
            sEye.delta_IACO =2* (sEye.inner_outside_anthus_angle - 170) / 170;
            sEye.delta_EFI =.5F* (sEye.eye_face_index - .618f)/.618F;

            #endregion
            //计算鼻偏差
            #region
            sNose.delta_NWWCB = .618f * (sNose.nose_width_compair_body - 1.318f) / 1.318f;
            sNose.delta_NWCFW = .618f * (sNose.nose_width_compair_facial_width - .232f) / .232f;
           
            sNose.delta_NHCFW = (sNose.nose_height_compair_facial_width-3.18f ) / 3.18f;
            sNose.delta_NI = .618f * (sNose.nose_index - .732f) / .732f;
            sNose.delta_NMI = .618f * (sNose.nose_mouth_index - .68f) / .68f;
           
            #endregion

            
            Calculate();
         
        }
        
        /// <summary>
        /// 计算各部分得分
        /// </summary>
        public  void Calculate() {

            //《bang 2017.02.20 改，
            sOutLine.delta_BBI = Math.Abs(sOutLine.delta_BBI) * Adjust_Delta(sOutLine.delta_BBI);
            sOutLine.delta_TPR = Math.Abs(sOutLine.delta_TPR) * Adjust_Delta(sOutLine.delta_TPR);
            sOutLine.delta_FER = Math.Abs(sOutLine.delta_FER) * (Adjust_Delta(sOutLine.delta_FER));
            sOutLine.delta_FWCMLH = Math.Abs(sOutLine.delta_FWCMLH) * Adjust_Delta(sOutLine.delta_FWCMLH);
            sOutLine.delta_LBCRB = Math.Abs(sOutLine.delta_LBCRB) * Adjust_Delta(Math.Abs(sOutLine.delta_LBCRB));
            sOutLine.delta_BA = Math.Abs(sOutLine.delta_BA) * Adjust_Delta(Math.Abs(sOutLine.delta_BA));
            sOutLine.delta_CA = Math.Abs(sOutLine.delta_CA) * Adjust_Delta(sOutLine.delta_CA);

            outLineScore = 100 * (1 - .9f * (
                   sOutLine.delta_BBI
                   + sOutLine.delta_TPR
                   + sOutLine.delta_FER
                   + sOutLine.delta_FWCMLH
                   + sOutLine.delta_LBCRB
                   + sOutLine.delta_BA
                   + sOutLine.delta_CA));
            if (outLineScore < 60) outLineScore = 60;
            if (outLineScore > 99.5) outLineScore = 99.5f;

            //《bang 2017.02.20 改，

            //》
            eyebrowScore = 100 * (
                   1 - .9f * (Math.Abs(sEyebrow.delta_LEEN) * Adjust_Delta(Math.Abs(sEyebrow.delta_LEEN))

                    + Math.Abs(sEyebrow.delta_REEN) * Adjust_Delta(Math.Abs(sEyebrow.delta_REEN))
                   + Math.Abs(sEyebrow.delta_LENA) * Adjust_Delta(Math.Abs(sEyebrow.delta_LENA))

                   + Math.Abs(sEyebrow.delta_RENA) * Adjust_Delta(Math.Abs(sEyebrow.delta_RENA))
                   + Math.Abs(sEyebrow.delta_ECND) * Adjust_Delta(Math.Abs(sEyebrow.delta_ECND))
                   
                   + Math.Abs(sEyebrow.delta_EA) * Adjust_Delta_eyebrow(sEyebrow.delta_EA)));
            
            if (eyebrowScore < 60) eyebrowScore = 60;
            if (eyebrowScore > 99.5) eyebrowScore = 99.5f;

            //《bang 2017.02.20 改，

            //》
            eyeScore = 100 * (1 - .9f * (Math.Abs(sEye.delta_EBWR) * Adjust_Delta(sEye.delta_EBWR)
                   + Math.Abs(sEye.delta_EBCIC) * Adjust_Delta(Math.Abs(sEye.delta_EBCIC))
                   + Math.Abs(sEye.delta_IACO) * Adjust_Delta_eyebrow(Math.Abs(sEye.delta_IACO))
                   + Math.Abs(sEye.delta_EFI) * Adjust_Delta(Math.Abs(sEye.delta_EFI))));
            if (eyeScore < 60) eyeScore = 60;
            if (eyeScore > 99.5) eyeScore = 99.5f;

            //《bang 2017.02.20 改，

            //》
            noseScore = 100 * (1 - .9f * (Math.Abs(sNose.delta_NWWCB) * Adjust_Delta(sNose.delta_NWWCB)
                   + Math.Abs(sNose.delta_NWCFW) * Adjust_Delta(sNose.delta_NWCFW)
                   
                   + Math.Abs(sNose.delta_NHCFW) * Adjust_Delta(sNose.delta_NHCFW)
                   + Math.Abs(sNose.delta_NI) * Adjust_Delta(sNose.delta_NI)
                   + Math.Abs(sNose.delta_NMI) * Adjust_Delta(Math.Abs(sNose.delta_NMI))));
            if (noseScore < 60) noseScore = 60;
            if (noseScore > 99.5) noseScore = 99.5f;

            //《bang 2017.02.20 改，分享指标计算有误

            //》
            

            mouthScore = 100 * (1 - .9f * (Math.Abs(sMouth.delta_MBCMC) * Adjust_Delta(sMouth.delta_MBCMC)
                   + Math.Abs(sMouth.delta_NMCNC) * Adjust_Delta(sMouth.delta_NMCNC)
                   + Math.Abs(sMouth.delta_MBCED) * Adjust_Delta(Math.Abs(sMouth.delta_MBCED))
                   + Math.Abs(sMouth.delta_MI) * Adjust_Delta(Math.Abs(sMouth.delta_MI))
                   + Math.Abs(sMouth.delta_LEI) * Adjust_Delta(sMouth.delta_LEI)
                   + Math.Abs(sMouth.delta_LI) * Adjust_Delta(sMouth.delta_LI)
                   + Math.Abs(sMouth.delta_MA) * Adjust_Delta(sMouth.delta_MA)
                   +  Math.Abs(sMouth.delta_S)));

            if (mouthScore < 60) mouthScore = 60;
            if (mouthScore > 99.5) mouthScore = 99.5f;
            looksTotalScore = (outLineScore * 1.5f + eyebrowScore * .8f + eyeScore + noseScore + mouthScore * .8f) / (1.5f + .8f + 1 + 1 + .8f);
            looksTotalScore = (double)Math.Round(looksTotalScore, 1);

            //随机添加一些小数，不要全是整数，全是整数会很假
            int[] a = { 1, 2, 3, 4, 5 };
            Random r = new Random();
            int start = r.Next(0, 4);
            int[] b = new int[5];
            for (int i = 0; i < 4 - start+1; i++)
            {
                b[i] = a[start+i];
                
            }
            for (int i = 4 - start + 1; i < 5; i++) {

                b[i] = a[4-i];
            }

            sKanXiang.outLine = (75 + 15 * (outLineScore-60) / 40 +b[0])/100;
            sKanXiang.eyebrow = (75 + 15 * (eyebrowScore-60) / 40 + b[1])/100;
            sKanXiang.eye = (75 + 15 * (eyeScore - 60) / 40 + b[2])/100;
            sKanXiang.nose = (75 + 15 * (noseScore - 60) / 40 + b[3])/100;
            sKanXiang.mouth = (75 + 15 *( mouthScore - 60) / 40 + b[4]) / 100;
            kanXiangScore = 100 * (1.5f*sKanXiang.outLine + sKanXiang.eyebrow + sKanXiang.eye + sKanXiang.nose + sKanXiang.mouth) / 5.5f;

            outLineScore = (double)Math.Round(outLineScore, 1);//取一位小数
            eyebrowScore= (double)Math.Round(eyebrowScore, 1);
            eyeScore= (double)Math.Round(eyeScore, 1);
            noseScore= (double)Math.Round(noseScore, 1);
            mouthScore= (double)Math.Round(mouthScore, 1);
            kanXiangScore= (double)Math.Round(kanXiangScore, 1);
            //2017/1/17修改，把所有比值变成分数
         

            //2017/1/19修改,会造成变量重复，后期修改之<<<
            testValue = new TestValue();
            testValue.totleScore = LooksTotalScore;
            testValue.sTotle_Scores.outLineScore = OutLineScore;
            testValue.sTotle_Scores.eyebrowScore = EyebrowScore;
            testValue.sTotle_Scores.eyeScore = EyeScore;
            testValue.sTotle_Scores.noseScore = NoseScore;
            testValue.sTotle_Scores.mouthScore = MouthScore;
            testValue.sTotle_Scores.kanXiangScore = KanXiangScore;
            
            testValue.sOutLine_Scores.delta_BA = SOutLine.delta_BA;
            testValue.sOutLine_Scores.delta_BBI = SOutLine.delta_BBI;
            testValue.sOutLine_Scores.delta_CA = SOutLine.delta_CA;
            testValue.sOutLine_Scores.delta_FER = SOutLine.delta_FER;
            testValue.sOutLine_Scores.delta_FWCMLH = SOutLine.delta_FWCMLH;
            testValue.sOutLine_Scores.delta_LBCRB = SOutLine.delta_LBCRB;
            testValue.sOutLine_Scores.delta_TPR = SOutLine.delta_TPR;

            testValue.sEyebrow_Scores.delta_EA = SEyebrow.delta_EA;
            testValue.sEyebrow_Scores.delta_ECND = SEyebrow.delta_ECND;
            testValue.sEyebrow_Scores.delta_LEEN = SEyebrow.delta_LEEN;
            testValue.sEyebrow_Scores.delta_LENA = SEyebrow.delta_LENA;
            testValue.sEyebrow_Scores.delta_REEN = SEyebrow.delta_REEN;
            testValue.sEyebrow_Scores.delta_RENA = SEyebrow.delta_RENA;

            testValue.sEye_Scores.delta_EBCIC = SEye.delta_EBCIC;
            testValue.sEye_Scores.delta_EBWR = SEye.delta_EBWR;
            testValue.sEye_Scores.delta_EFI = SEye.delta_EFI;
            testValue.sEye_Scores.delta_IACO = SEye.delta_IACO;

            testValue.sNose_Scores.delta_NHCFW = SNose.delta_NHCFW;
            testValue.sNose_Scores.delta_NI = SNose.delta_NI;
            testValue.sNose_Scores.delta_NMI = SNose.delta_NMI;
            testValue.sNose_Scores.delta_NWCFW = SNose.delta_NWCFW;
            testValue.sNose_Scores.delta_NWWCB = SNose.delta_NWWCB;

            testValue.sMouth_Scores.delta_LEI = SMouth.delta_LEI;
            testValue.sMouth_Scores.delta_LI = SMouth.delta_LI;
            
            testValue.sMouth_Scores.delta_MBCED = SMouth.delta_MBCED;
            testValue.sMouth_Scores.delta_MBCMC = SMouth.delta_MBCMC;
            testValue.sMouth_Scores.delta_MI = SMouth.delta_MI;
            testValue.sMouth_Scores.delta_NMCNC = SMouth.delta_NMCNC;
            testValue.sMouth_Scores.delta_S = SMouth.delta_S;

            testValue.sKanXiang_Scores.outLine = SKanXiang.outLine;
            testValue.sKanXiang_Scores.eyebrow = SKanXiang.eyebrow;
            testValue.sKanXiang_Scores.eye = SKanXiang.eye;
            testValue.sKanXiang_Scores.nose = SKanXiang.nose;
            testValue.sKanXiang_Scores.mouth = SKanXiang.mouth;
            //2017/1/19修改>>>
            //2017/2/27 修改各种分数，使其在子项指标的分数最大最小值内<<<
            CheckTestValue();

            //2017/2/27 修改各种分数，使其在子项指标的分数最大最小值内<<<
        }
        int currentIndex = 0;
        List<int> randoms;

       

        private double Random()
        {
            if (randoms == null || randoms.Count < 1) randoms = Core.CommomTool.GetRandom(5,30);
            currentIndex++;
            if (currentIndex > randoms.Count - 1) currentIndex = 0;

            return randoms[currentIndex];

        }


        /// <summary>
        /// 检查分数是否大于99分或者小于65分，不能越界
        /// </summary>
        private void CheckTestValue()
        {


            FieldInfo[] fields = testValue.GetType().GetFields(BindingFlags.Public | BindingFlags.Instance);

            for (int i = 0; i < fields.Length; i++)
            {

                object o = fields[i].GetValue(testValue);
                if (o.GetType() == typeof(double))
                {
                    double value = (double)o > 99 ? 99 : (double)o;
                    value = (double)o < 65 ? 65 : (double)o;
                    value = Math.Round(value + Random()/100, 2);
                    fields[i].SetValue(testValue, value);
                }
                else
                {

                    FieldInfo[] other_fields = o.GetType().GetFields(BindingFlags.Public | BindingFlags.Instance);
                    double average = 0;double maxLoss=0;
                    for (int j = 0; j < other_fields.Length; j++)
                    {
                        if (other_fields[j].GetValue(o).GetType() == typeof(double))
                        {
                            double value = (double)other_fields[j].GetValue(o);//如果是比例的话，你就是分项指标，要改成分数值
                            
                            if (value < 1 || value == 1)//表示数据为偏差，还未调整为分数
                            {
                                value = 100 * (1 -Math.Abs( value));
                                average += (value * 1 / other_fields.Length);
                            }
                            value = value > 99 ? 99 : value;
                            value = value < 65 ? 65 : value;
                            value = Math.Round(value + Random()/100, 2);
                            if (i == 6) {//i=6,表示口唇
                                if(j!=6 && (100 - value) > maxLoss) maxLoss = 100 - value;//j=6,表示微笑指标，不能让其影响过于严重
                                
                            }
                            else { 
                                if((100 - value ) > maxLoss ) maxLoss = 100 - value;
                            }
                            other_fields[j].SetValue(o, value);
                            fields[i].SetValue(testValue, o);
                        }

                    }

                    //又是矫正，让分值处于子指标之间
                    if (i > 1 && i!=7)
                    {
                        //double totalLoss = (100 - average)*other_fields.Length;
                        object obj_sTotalScore = fields[1].GetValue(testValue);
                        FieldInfo[] sTotalScore_fields = obj_sTotalScore.GetType().GetFields(BindingFlags.Public | BindingFlags.Instance);
                        double sCore_value = (double)sTotalScore_fields[i - 2].GetValue(obj_sTotalScore);//轮廓等分数各项与计算它的子项指标结构体相差脚标2
                        double gap_score = average - sCore_value;

                        for (int K = 0; K < other_fields.Length; K++)
                        {
                            if (other_fields[K].GetValue(o).GetType() == typeof(double))
                            {
                                double value = (double)other_fields[K].GetValue(o);
                                value = value - gap_score * (100 - value) / maxLoss;
                                value = value < 64 ? 64  : value;
                                value = Math.Round(value + Random() / 100, 2);
                                other_fields[K].SetValue(o, value);
                                fields[i].SetValue(testValue, o);
                            }

                        }
                    }
                }

            }

           


        }

        /// <summary>
        /// 根据偏差百分比给予不同权重，10+% 比重就是.1,100+% 比重就是1
        /// </summary>
        /// <param name="delta"></param>
        /// <returns></returns>
        private double Adjust_Delta(double delta) {
            if (delta < -0.3) return .5f * Math.Abs((double)(delta / .1));
            if (delta < -0.1) return .2f * Math.Abs((double)(delta / .1));
            if (delta < 0) return .1f*Math.Abs((double)(delta / .1));
            if (delta > .15) return 1.5f;
            return (double)(delta / .1);
        }
        /// <summary>
        /// 根据偏差百分比给予不同权重，10+% 比重就是.1,100+% 比重就是1
        /// </summary>
        /// <param name="delta"></param>
        /// <returns></returns>
        private double Adjust_Delta_eyebrow(double delta)
        {
            if (delta < -0.3) return .5f * Math.Abs((double)(delta / .1));
            if (delta < -0.1) return .2f * Math.Abs((double)(delta / .1));
            if (delta < 0) return .1f * Math.Abs((double)(delta / .1));
            //if (delta > .1) return 1;
            return (double)(delta / .1);
        }
        /// <summary>
        /// 转换face++点到实际图片的像素点，有一个校正！
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        private System.Drawing.Point FacePoit_To_SystemPoint(Point p) {

            return new System.Drawing.Point((int )(p.x * ima_width / 100.0 - ima_width / 100.0),(int) (p.y * ima_height / 100.0 - ima_height / 100.0));
        }

        
        /// <summary>
        /// 计算夹角
        /// </summary>
        /// <param name="cen"></param>
        /// <param name="first"></param>
        /// <param name="second"></param>
        /// <returns></returns>
        private double Angle(FaceppSDK. Point cen, Point first, Point second)
        {
            return Angle(FacePoit_To_SystemPoint(cen), FacePoit_To_SystemPoint(first), FacePoit_To_SystemPoint(second));
            

        }

        /// <summary>
        /// 计算夹角
        /// </summary>
        /// <param name="cen"></param>
        /// <param name="first"></param>
        /// <param name="second"></param>
        /// <returns></returns>
        private double Angle(System.Drawing.Point cen, System.Drawing.Point first, System.Drawing.Point second)
        {
            const double M_PI = 3.1415926535897;

            double ma_x = first.X - cen.X;
            double ma_y = first.Y - cen.Y;
            double mb_x = second.X - cen.X;
            double mb_y = second.Y - cen.Y;
            double v1 = (ma_x * mb_x) + (ma_y * mb_y);
            double ma_val = Math.Sqrt(ma_x * ma_x + ma_y * ma_y);
            double mb_val = Math.Sqrt(mb_x * mb_x + mb_y * mb_y);
            double cosM = v1 / (ma_val * mb_val);
            double angleAMB = Math.Acos(cosM) * 180 / M_PI;

            return (double)angleAMB;
        }

        /// <summary>
        /// 计算两点间距离
        /// </summary>
        /// <param name="p1"></param>
        /// <param name="p2"></param>
        /// <returns></returns>
        private double Distance(Point p1,Point p2) {
            System.Drawing.Point pr1 = FacePoit_To_SystemPoint(p1);
            System.Drawing.Point pr2 = FacePoit_To_SystemPoint(p2);

            return (double)Math.Sqrt(Math.Pow(Math.Abs(pr1.X - pr2.X), 2.0) + Math.Pow(Math.Abs(pr1.Y - pr2.Y), 2.0));
            
        }

        /// <summary>
        /// 求中点
        /// </summary>
        /// <param name="p1"></param>
        /// <param name="p2"></param>
        /// <returns></returns>
        private Point Center(Point p1, Point p2)
        {
            
            Point p = new Point();
            p.x = (p1.x - p2.x) / 2 + p2.x;
            p.y = (p1.y - p2.y) / 2 + p2.y;
            return p;
        }
    }
}
