from django.db import models


class Employee(models.Model):

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)

    joining_date = models.DateField()

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Active'
    )

    def __str__(self):
        return self.name