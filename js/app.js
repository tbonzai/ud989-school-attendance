var Model = {
	characters: [],

	attendance: {},

	init: function() {
		this.add_character('Slappy the Frog');
		this.add_character('Lilly the Lizard');
		this.add_character('Paulrus the Walrus');
		this.add_character('Gregory the Goat');
    	this.add_character('Adam the Anaconda');
	},

	add_character:function(character_name) {
		this.characters.push(character_name);
		this.attendance[this.characters.length - 1] = [];
		for (var i = 0; i < 12; i++) {
			this.attendance[this.characters.length - 1].push(Math.random() >= 0.5)
		}
	},

	get_name: function(character_id) {
		return this.characters[character_id];
	},

	get_attendance: function(character_id) {
		return this.attendance[character_id];
	},

	get_days_missed: function(character_id) {
		var returnVal = 0;
		for (var i = 0; i < this.attendance[character_id].length; i++) {
			if (this.attendance[character_id][i] === false) {
				returnVal++;
			}
		}
		return returnVal;
	},

	set_day_attendance:function(character_id, day_index, present) {
		this.attendance[character_id][day_index] = present;
	}
}

var Controller = {

	init:function() {
		var character_name = '',
			daily_attendance = [],
			days_missed = 0,
			i = 0;

		Model.init();
		View.init();
		for (var i = 0; i <  Model.characters.length; i++) {
			character_name = Model.get_name(i);
			daily_attendance = Model.get_attendance(i);
			days_missed = Model.get_days_missed(i);
			View.render_student(i, character_name, daily_attendance, days_missed);
		}
		View.setup_clicks();
	},

	update_attendance:function(student_id, day_number, present) {
		var days_missed = 0;
		Model.set_day_attendance(student_id, day_number, present);
		days_missed = Model.get_days_missed(student_id);
		View.update_missed(student_id, days_missed)
	}

};

var View = {
	$students: null,

	init: function() {
		this.$students = $('#student_table tbody');
	},

	render_student: function(student_id, student_name, daily_attendance, days_missed) {
		var
			new_student = '',
			checked = '';

		new_student = '<tr class="student" id="student_' + student_id +
			'"><td class="name-col">' + student_name + '</td>';

		for (var i = 0; i < daily_attendance.length; i++) {
			if (daily_attendance[i] === true) {
				checked = ' checked="checked"';
			} else {
				checked = '';
			}
			new_student += '<td class="attend-col"><input class="day_' + i + '" type="checkbox" ' + checked + '></td>'
		}

		new_student +=
			'<td class="missed-col">' + days_missed + '</td>' +
			'</tr>';

		this.$students.append(new_student);
	},

	setup_clicks: function() {
		this.$students.find(':checkbox').click(function(event) {
			var $this = $(this);
			var student_id = $this.parent().parent().attr('id').replace('student_', '');
			var day_number = $this.attr('class').replace('day_', '');
			var checked = $this.is(':checked');
			Controller.update_attendance(student_id, day_number, checked);
		});
	},

	update_missed: function(student_id, days_missed) {
		this.$students.find('#student_' + student_id).find('.missed-col').html(days_missed);
	}
};

$(function() {
    Controller.init();
}());
