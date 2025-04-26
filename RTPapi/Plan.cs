namespace RTPapi
{
    // 保存到数据库的实体
    public class Plan
    {
        public int Id { get; set; } // 自增主键
        public string PlanId { get; set; } = string.Empty; // 唯一标识
        public string Email { get; set; } = string.Empty; // 属于哪个用户
        public DateTime CreatedAt { get; set; } // 生成时间
        public string PlanData { get; set; } = string.Empty; // JSON格式保存的学习计划
    }

    // 前端发送过来的请求体
    public class PlanRequest
    {
        public string Email { get; set; } = string.Empty; // 谁发的请求
        public string PlanDescription { get; set; } = string.Empty; // 描述需求
    }

    // 后端返回给前端的响应体
    public class PlanResponse
    {
        public string PlanId { get; set; } = string.Empty; // 计划ID
        public DateTime CreatedAt { get; set; } // 创建时间
        public List<PlanStage> Plan { get; set; } = new(); // 返回的计划内容
    }

    // 学习计划里的每一个小阶段
    public class PlanStage
    {
        public int Stage { get; set; } // 阶段数（第1阶段、第2阶段……）
        public string Skill { get; set; } = string.Empty; // 技能名字
        public int Hours { get; set; } // 预计花费的时间
    }
}