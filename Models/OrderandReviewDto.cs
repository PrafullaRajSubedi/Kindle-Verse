using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Kindle_Verse.Models
{
    // DTOs for Orders
    public class OrderDto
    {
        public int Id { get; set; }
        public required string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public required string Status { get; set; }
        public long UserId { get; set; }
        public required string UserName { get; set; }

        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();

        public string? Otp { get; set; }
    }

    public class CreateOrderDto
    {
        [Required]
        public List<CreateOrderItemDto> OrderItems { get; set; }

        public string? PromoCode { get; set; }

        public decimal? FinalTotal { get; set; }

    }

    public class UpdateOrderStatusDto
    {
        [Required]
        [StringLength(20)]
        public required string Status { get; set; }
    }

    // DTOs for Order Items
    public class OrderItemDto
    {
        public int Id { get; set; }
        public required string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int OrderId { get; set; }
    }

    public class CreateOrderItemDto
    {
        [Required][StringLength(100)] public string ProductName { get; set; }
        [Required][Range(1, 1000)] public int Quantity { get; set; }
        [Required][Range(0.01, 10000)] public decimal Price { get; set; }
    }

    // Order status enum (recommended)
    public enum OrderStatus
    {
        Pending,
        Processing,
        Shipped,
        Completed,
        Cancelled
    }
}
