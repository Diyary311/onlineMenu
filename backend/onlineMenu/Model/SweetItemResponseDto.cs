namespace onlineMenu.Model
{
    public class SweetItemResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public double Size { get; set; }
        public string TypeOfMoney { get; set; }
        public string ImageUrl { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
