﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ScheduleAppBackend.Context;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    [DbContext(typeof(ScheduleAppContext))]
    partial class ScheduleAppContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ScheduleAppBackend.Models.Business", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("CustomUrl")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("character varying(60)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Businesses");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessHours", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("BusinessId")
                        .HasColumnType("integer");

                    b.Property<int>("Day")
                        .HasColumnType("integer");

                    b.Property<int>("IntervalEnd")
                        .HasColumnType("integer");

                    b.Property<int>("IntervalStart")
                        .HasColumnType("integer");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.ToTable("BusinessesHours");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessService", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("BusinessId")
                        .HasColumnType("integer");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<int>("Duration")
                        .HasColumnType("integer");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal?>("Price")
                        .HasColumnType("numeric");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.HasIndex("CategoryId");

                    b.ToTable("BusinessesServices");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessServiceCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("BusinessId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.ToTable("BusinessesServicesCategories");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(320)
                        .HasColumnType("character varying(320)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProfileUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.Business", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessHours", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.Business", "Business")
                        .WithMany()
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Business");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessService", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.Business", "Business")
                        .WithMany()
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.BusinessServiceCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.Navigation("Business");

                    b.Navigation("Category");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessServiceCategory", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.Business", "Business")
                        .WithMany()
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Business");
                });
#pragma warning restore 612, 618
        }
    }
}
