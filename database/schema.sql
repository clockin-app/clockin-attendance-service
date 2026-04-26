CREATE TABLE IF NOT EXISTS attendance_records (
  id          VARCHAR(36)                        NOT NULL,
  employee_id VARCHAR(36)                        NOT NULL,
  check_in    DATETIME                           NOT NULL,
  check_out   DATETIME                           NULL,
  work_date   DATE                               NOT NULL,
  status      ENUM('PRESENT','LATE','HALF_DAY')  NOT NULL,
  notes       TEXT                               NULL,
  created_at  DATETIME                           NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_attendance_records_work_date   (work_date),
  INDEX idx_attendance_records_employee_id (employee_id)
);

CREATE TABLE IF NOT EXISTS attendance_photos (
  id            VARCHAR(36)                  NOT NULL,
  attendance_id VARCHAR(36)                  NOT NULL,
  photo_url     VARCHAR(500)                 NOT NULL,
  photo_type    ENUM('CHECK_IN','CHECK_OUT') NOT NULL,
  uploaded_at   DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_attendance_photos_attendance_id
    FOREIGN KEY (attendance_id) REFERENCES attendance_records (id)
    ON DELETE CASCADE
);
