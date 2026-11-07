import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0003_employee_department_ref'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='department',
        ),

        migrations.RenameField(
            model_name='employee',
            old_name='department_ref',
            new_name='department',
        ),

        migrations.AlterField(
            model_name='employee',
            name='department',
            field=models.ForeignKey(
                to='employees.department',
                on_delete=django.db.models.deletion.PROTECT,
                related_name='employees',
            ),
        ),
    ]