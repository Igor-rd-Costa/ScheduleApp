﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ScheduleAppBackend.Context;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    [DbContext(typeof(ScheduleAppContext))]
    [Migration("20240705210844_AddIconColumnToBusinessService")]
    partial class AddIconColumnToBusinessService
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ScheduleAppBackend.Models.Appointment", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("ClientId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("BusinessId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("EmployeeId")
                        .HasColumnType("uuid");

                    b.Property<int>("ServiceId")
                        .HasColumnType("integer");

                    b.Property<int>("Time")
                        .HasColumnType("integer");

                    b.HasKey("Id", "ClientId");

                    b.HasIndex("BusinessId");

                    b.HasIndex("ClientId");

                    b.HasIndex("EmployeeId");

                    b.HasIndex("ServiceId", "BusinessId");

                    b.ToTable("Appointments");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.Business", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("AddressNumber")
                        .HasColumnType("integer");

                    b.Property<string>("BusinessUrl")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("character varying(60)");

                    b.Property<int>("CityId")
                        .HasColumnType("integer");

                    b.Property<int>("CountryId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("HasUnseenNotifications")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uuid");

                    b.Property<int>("StateId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CityId");

                    b.HasIndex("CountryId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("StateId");

                    b.ToTable("Businesses");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessEmployee", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("EmployeeId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("BusinessId")
                        .HasColumnType("uuid");

                    b.HasKey("Id", "EmployeeId");

                    b.HasIndex("BusinessId");

                    b.HasIndex("EmployeeId");

                    b.ToTable("BusinessEmployees");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessEmployeeHours", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("EmployeeId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("BusinessId")
                        .HasColumnType("uuid");

                    b.Property<int>("EndTime")
                        .HasColumnType("integer");

                    b.Property<int>("StartTime")
                        .HasColumnType("integer");

                    b.HasKey("Id", "EmployeeId");

                    b.HasIndex("BusinessId");

                    b.HasIndex("EmployeeId");

                    b.ToTable("BusinessEmployeesHours");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessHours", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("BusinessId")
                        .HasColumnType("uuid");

                    b.Property<int>("Day")
                        .HasColumnType("integer");

                    b.Property<int>("IntervalEnd")
                        .HasColumnType("integer");

                    b.Property<int>("IntervalStart")
                        .HasColumnType("integer");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id", "BusinessId");

                    b.HasIndex("BusinessId");

                    b.ToTable("BusinessesHours");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessNotification", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uuid");

                    b.Property<string>("Heading")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Time")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("WasVisualized")
                        .HasColumnType("boolean");

                    b.HasKey("Id", "OwnerId");

                    b.ToTable("BusinessNotifications");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessService", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("BusinessId")
                        .HasColumnType("uuid");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("integer");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<int>("Duration")
                        .HasColumnType("integer");

                    b.Property<string>("Icon")
                        .HasColumnType("text");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal?>("Price")
                        .HasColumnType("numeric");

                    b.HasKey("Id", "BusinessId");

                    b.HasIndex("BusinessId");

                    b.HasIndex("CategoryId", "BusinessId");

                    b.ToTable("BusinessesServices");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessServiceCategory", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("BusinessId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id", "BusinessId");

                    b.HasIndex("BusinessId");

                    b.ToTable("BusinessesServicesCategories");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.LocationCity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CountryId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("StateId")
                        .HasColumnType("integer");

                    b.Property<int?>("TimeZoneId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("CountryId");

                    b.HasIndex("StateId");

                    b.HasIndex("TimeZoneId");

                    b.ToTable("LocationCities");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.LocationCountry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Currency")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ISOCode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("LocationCountries");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.LocationState", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CountryId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CountryId");

                    b.ToTable("LocationStates");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.LocationTimeZone", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Offset")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("LocationTimeZones");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(320)
                        .HasColumnType("character varying(320)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("HasUnseenNotifications")
                        .HasColumnType("boolean");

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

            modelBuilder.Entity("ScheduleAppBackend.Models.UserNotification", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uuid");

                    b.Property<string>("Heading")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("Time")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("WasVisualized")
                        .HasColumnType("boolean");

                    b.HasKey("Id", "OwnerId");

                    b.ToTable("UserNotifications");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.Appointment", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.Business", "Business")
                        .WithMany()
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.User", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.User", "Employee")
                        .WithMany()
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.BusinessService", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceId", "BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Business");

                    b.Navigation("Client");

                    b.Navigation("Employee");

                    b.Navigation("Service");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.Business", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.LocationCity", "City")
                        .WithMany()
                        .HasForeignKey("CityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.LocationCountry", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.LocationState", "State")
                        .WithMany()
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("City");

                    b.Navigation("Country");

                    b.Navigation("State");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessEmployee", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.Business", "Business")
                        .WithMany()
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.User", "Employee")
                        .WithMany()
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Business");

                    b.Navigation("Employee");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.BusinessEmployeeHours", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.Business", "Business")
                        .WithMany()
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.User", "Employee")
                        .WithMany()
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Business");

                    b.Navigation("Employee");
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
                        .HasForeignKey("CategoryId", "BusinessId");

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

            modelBuilder.Entity("ScheduleAppBackend.Models.LocationCity", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.LocationCountry", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.LocationState", "State")
                        .WithMany()
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ScheduleAppBackend.Models.LocationTimeZone", "TimeZone")
                        .WithMany()
                        .HasForeignKey("TimeZoneId");

                    b.Navigation("Country");

                    b.Navigation("State");

                    b.Navigation("TimeZone");
                });

            modelBuilder.Entity("ScheduleAppBackend.Models.LocationState", b =>
                {
                    b.HasOne("ScheduleAppBackend.Models.LocationCountry", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Country");
                });
#pragma warning restore 612, 618
        }
    }
}