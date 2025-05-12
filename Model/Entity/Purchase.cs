namespace CourseWork.Model.Entity
{
    public class Purchase
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public int BookId { get; set; }
        public Books Book { get; set; }

        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    }
}
