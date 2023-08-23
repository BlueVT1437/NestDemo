INSERT INTO permissions(permission)
VALUES ('ABLE_TO_GET_TODO'), ('ABLE_TO_CREATE_TODO'), ('ABLE_TO_UPDATE_TODO');

INSERT INTO role_permissions(permission_id, role_id)
VALUES (1, 1), (1, 2), (2, 1);