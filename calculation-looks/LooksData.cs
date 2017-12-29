using FaceppSDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LooksAnalyzing
{
   public class LooksData
    {
        protected double looksTotalScore;//面容总分
        protected Face face;//face++原始数据
        protected Landmark landmark;//landmark

        protected string image_path;//没用

        protected int ima_width;//对应图像宽度
        protected int ima_height;//对应图像高度

        protected KanXiang sKanXiang;//看相参数
        protected double kanXiangScore;//看相分数
        protected OutLine sOutLine;//轮廓参数
        protected double outLineScore;//轮廓评分
        protected Eyebrow sEyebrow;//眉参数
        protected double eyebrowScore;//眉评分
        protected Eye sEye;//眼参数
        protected double eyeScore;//眼评分
        protected Nose sNose;//鼻参数
        protected double noseScore;//鼻评分
        protected Mouth sMouth;//口参数
        protected double mouthScore;//口评分

        protected TestValue testValue;//计算结果

        public double LooksTotalScore
        {
            get
            {
                return looksTotalScore;
            }

            set
            {
                looksTotalScore = value;
            }
        }

        public Face Face
        {
            get
            {
                return face;
            }

            set
            {
                face = value;
            }
        }

        public Landmark Landmark
        {
            get
            {
                return landmark;
            }

            set
            {
                landmark = value;
            }
        }

        public string Image_path
        {
            get
            {
                return image_path;
            }

            set
            {
                image_path = value;
            }
        }

        

        public int Ima_width
        {
            get
            {
                return ima_width;
            }

            set
            {
                ima_width = value;
            }
        }

        public int Ima_height
        {
            get
            {
                return ima_height;
            }

            set
            {
                ima_height = value;
            }
        }

        public KanXiang SKanXiang
        {
            get
            {
                return sKanXiang;
            }

            set
            {
                sKanXiang = value;
            }
        }

        public double KanXiangScore
        {
            get
            {
                return kanXiangScore;
            }

            set
            {
                kanXiangScore = value;
            }
        }

        public OutLine SOutLine
        {
            get
            {
                return sOutLine;
            }

            set
            {
                sOutLine = value;
            }
        }

        public double OutLineScore
        {
            get
            {
                return outLineScore;
            }

            set
            {
                outLineScore = value;
            }
        }

        public Eyebrow SEyebrow
        {
            get
            {
                return sEyebrow;
            }

            set
            {
                sEyebrow = value;
            }
        }

        public double EyebrowScore
        {
            get
            {
                return eyebrowScore;
            }

            set
            {
                eyebrowScore = value;
            }
        }

        public Eye SEye
        {
            get
            {
                return sEye;
            }

            set
            {
                sEye = value;
            }
        }

        public double EyeScore
        {
            get
            {
                return eyeScore;
            }

            set
            {
                eyeScore = value;
            }
        }

        public Nose SNose
        {
            get
            {
                return sNose;
            }

            set
            {
                sNose = value;
            }
        }

        public double NoseScore
        {
            get
            {
                return noseScore;
            }

            set
            {
                noseScore = value;
            }
        }

        public Mouth SMouth
        {
            get
            {
                return sMouth;
            }

            set
            {
                sMouth = value;
            }
        }

        public double MouthScore
        {
            get
            {
                return mouthScore;
            }

            set
            {
                mouthScore = value;
            }
        }

        public TestValue TestValue
        {
            get
            {
                return testValue;
            }

            set
            {
                testValue = value;
            }
        }

        /// <summary>
        /// 看相数据
        /// </summary>
        public struct KanXiang
        {

            public double outLine;//轮廓相
            public double eyebrow;//眉相
            public double eye;//眼相
            public double nose;//鼻相
            public double mouth;//口唇相
        }
        /// <summary>
        /// 看相的评分封装在这里
        /// </summary>
        public struct KanXiang_Score
        {
            public double outLine;//轮廓相
            public double eyebrow;//眉相
            public double eye;//眼相
            public double nose;//鼻相
            public double mouth;//口唇相

        }
        /// <summary>
        /// 轮廓评分
        /// </summary>
        public struct OutLine_Score
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
        /// 轮廓数据
        /// </summary>
        public struct OutLine
        {
            //面宽
            public double facial_width;
            public double morphological_facial_height;//形态面高
            public double physiognomic_upper_height;//容貌上面高
            public double facial_middle_lower_height;//中下面高
            public double facial_middle_height;//中面高
            public double facial_lower_height;//下面高
            public double morphological_facial_index;//形态面指数
            public double bigonial_breadth;//两下颌角间宽
            public double eyeballDistance;//瞳孔距离
            public double left_bigonial_angle;//左下颧颌角
            public double right_bigonial_angle;//右下颧颌角
            //用于评分的指标
            public double three_part_rate;//三庭指标，标准 1：1
            public double five_eye_rate;//五眼指数   标准 5：1
            public double facial_width_compair_middle_lower_height;//面宽与中下面之比 1：1
            public double left_bigonial_compair_right_bigonial;//左右下颌角对称性 1：1
            public double bigonial_breadth_index;//颧下颌宽度指数 0.819:1
            public double chin_angle;//下巴角度
            public double bigonial_angle;//颧合角平均值168°

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
        public struct Eyebrow_Score
        {

            public double delta_LENA;// 眉与鼻翼连线和眉的夹角标准差值 左眉对称性
            public double delta_RENA;//眉与鼻翼连线和眉的夹角标准差值  右眉对称性
            public double delta_LEEN;//眉尾眼外角鼻翼形成的夹角与标准差值  左眉眼鼻连线
            public double delta_REEN;//眉尾眼外角鼻翼形成的夹角与标准差值  右眉眼鼻连线
            public double delta_ECND;//眉间距与鼻翼宽比较  眉间距
            public double delta_EA;//左右眉角度平均值与标准值差值  眉水平角
        }

        /// <summary>
        /// 眉数据
        /// </summary>
        public struct Eyebrow
        {

            public double eyebrow_distance;//眉间距
            public double left_eyebrow_nose_angle;//左眉与鼻翼连线和眉的夹角，一般为90°
            public double right_eyebrow_nose_angle;//右眉与鼻翼连线和眉的夹角，一般为90°
            public double left_eyebrow_angle;//左眉倾斜角
            public double right_eyebrow_angle;//右眉倾斜角
            public double left_eyebrowEnd_eyeEnd_noseWing;//左眉尾眼外角鼻翼形成的夹角，一般180°，即要三点一线
            public double right_eyebrowEnd_eyeEnd_noseWing;//右眉尾眼外角鼻翼形成的夹角，一般180°，即要三点一线
            public double eyebrow_compair_nose_distance;//眉间距与鼻翼宽比较
            public double eyebrow_angle;//左右眉角度平均值
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
        public struct Eye_Score
        {


            public double delta_EBWR;//眼裂宽高比与标准比较 
            public double delta_EBCIC;//眼宽/内眦间距之比与标准比较  
            public double delta_IACO;//内眦-外眦角与标准比较
            public double delta_EFI;//目面指数 与标准比较

        }

        /// <summary>
        /// 眼数据
        /// </summary>
        public struct Eye
        {

            public double left_eye_break_hight;//左眼裂高
            public double right_eye_break_hight;//右眼裂高
            public double left_eye_break_width;//左眼裂长
            public double right_eye_break_width;//右眼裂长
            public double inner_canthus_distance;//内眦间距
            public double outside_canthus_distance;//外眦间距
            public double left_inner_outside_anthus_angle;//左内外眦夹角
            public double right_inner_outside_anthus_angle;//右内外眦夹角
            public double inner_outside_anthus_angle;//内外眦角
            public double eye_break_WH_rate;//眼裂宽高比 .382
            public double eye_break_compair_inner_canthus;//眼宽与内眦间距之比，1：1
            public double eye_face_index;//目面指数 .819：1
            public double delta_EBWR;//眼裂宽高比与标准比较 
            public double delta_EBCIC;//眼宽/内眦间距之比与标准比较  
            public double delta_IACO;//内眦-外眦角与标准比较
            public double delta_EFI;//目面指数 与标准比较

        }
        /// <summary>
        /// 鼻评分
        /// </summary>
        public struct Nose_Score
        {


            public double delta_NWWCB;//鼻翼体宽之比与标准差值  鼻形状
            public double delta_NWCFW;//鼻面宽之比与标准之差    鼻宽/面宽
            public double delta_NHCFW;//鼻长面宽之比与标准之差  鼻长/面宽
            public double delta_NI;//鼻指数与标准之差
            public double delta_NMI;//鼻唇指数
        }


        /// <summary>
        /// 鼻数据
        /// </summary>
        public struct Nose
        {

            public double nose_width;//鼻翼宽
            public double nose_body_width;//鼻体宽
            public double nose_height;//鼻高
            public double nose_width_compair_body;//鼻体/鼻翼 1：.8
            public double nose_width_compair_facial_width;//鼻翼与面宽之比
            public double nose_height_compair_facial_width;//鼻高与面宽之比
            public double nose_index;//鼻指数 鼻宽/鼻高
            public double nose_mouth_index;//鼻唇指数 鼻宽/口角间距
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
        public struct Mouth_Score
        {

            public double delta_MBCMC;//口宽/颏高与标准差值
            public double delta_NMCNC;//口鼻距离 ： 颏鼻距离与标准差值
            public double delta_MBCED;//口宽/瞳距与标准差值
            public double delta_MI;//口指数与标准差值
            public double delta_LEI;//唇目指数 与标准差值
            public double delta_LI;//唇指数 与标准差值
            public double delta_MA;//口唇水平角 与标准差值
            public double delta_S;//微笑指数与标准差值
        }

        /// <summary>
        /// 口数据
        /// </summary>
        public struct Mouth
        {

            public double mouth_width;//口宽
            public double mouth_chin_distance;//颏高
            public double nose_mouth_distance;//鼻下到口裂距离
            public double nose_chin_distance;//鼻下到颏下距离
            public double lip_hight;//唇高
            public double mouth_width_compair_mouth_chin;//口宽 ： 颏高 1：1
            public double nose_mouth_compair_nose_chin;//口鼻距离 ： 颏鼻距离 1 : 3
            public double mouth_width_compair_eyeBall_distance;//口宽 ： 瞳距 1：1
            public double mouth_index;//口指数 唇高/口宽
            public double lip_eye_index;//唇目指数 口宽/眼外眦距 0.618
            public double lip_index;//唇指数 上唇/下唇 .618
            public double mouth_angle;//口唇水平角 口角应该水平或微微上翘
            public double smile;//微笑程度

            public double delta_MBCMC;//口宽/颏高与标准差值
            public double delta_NMCNC;//口鼻距离 ： 颏鼻距离与标准差值
            public double delta_MBCED;//口宽/瞳距与标准差值
            public double delta_MI;//口指数与标准差值
            public double delta_LEI;//唇目指数 与标准差值
            public double delta_LI;//唇指数 与标准差值
            public double delta_MA;//口唇水平角 与标准差值
            public double delta_S;//微笑指数与标准差值
        }
    }
}
