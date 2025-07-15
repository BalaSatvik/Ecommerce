package com.product.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.product.dao.ProductApprovalDAO;
import com.product.domain.ProductRequest;
import com.product.enums.RequestStatus;

@Repository
public class ProductApprovalDAOImpl implements ProductApprovalDAO {

	private final NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    public ProductApprovalDAOImpl(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

	private static class ProductApprovalMapper implements RowMapper<ProductRequest> {
		@Override
		public ProductRequest mapRow(ResultSet rs, int rowNum) throws SQLException {
			ProductRequest productRequest = new ProductRequest();

			productRequest.setProductRequestId(rs.getLong("ProductRequestId"));
			productRequest.setProductName(rs.getString("ProductName"));
			productRequest.setPrice(rs.getBigDecimal("Price"));
			productRequest.setDescription(rs.getString("Description"));
			productRequest.setQuantity(rs.getInt("Quantity"));
			productRequest.setRequestedBy(rs.getLong("RequestedBy"));

			String productRequestStatus = rs.getString("Status");
			if ("A".equalsIgnoreCase(productRequestStatus)) {
				productRequest.setStatus(RequestStatus.APPROVED);
			} else if ("D".equalsIgnoreCase(productRequestStatus)) {
				productRequest.setStatus(RequestStatus.DECLINED);
			} else {
				productRequest.setStatus(RequestStatus.PENDING);
			}
			productRequest.setApprovedBy(rs.getObject("ApprovedBy") != null ? rs.getLong("ApprovedBy") : null);

			productRequest.setCreatedAtDate(
					rs.getTimestamp("CreatedAtDate") != null ? rs.getTimestamp("CreatedAtDate").toLocalDateTime()
							: null);
			productRequest.setUpdatedAtDate(
					rs.getTimestamp("UpdatedAtDate") != null ? rs.getTimestamp("UpdatedAtDate").toLocalDateTime()
							: null);
			return productRequest;
		}
	}

	@Override
	public List<ProductRequest> getRequests(List<Long> productRequestId,Integer flagIds ,List<RequestStatus> status,Integer flagStatus) {
		String sqlQuery = "SELECT ProductRequestId, ProductName, Description, Price,"+
				" Quantity, RequestedBy, Status, ApprovedBy, CreatedAtDate, "+
				"UpdatedAtDate FROM product_requests WHERE "+
				"((0 = :flagIds) OR (ProductRequestId IN (:ids))) AND "+
				"((0 = :flagStatus) OR (Status IN (:status)))";

		    MapSqlParameterSource parameters = new MapSqlParameterSource();
		    parameters.addValue("flagIds", flagIds);
		    parameters.addValue("ids",productRequestId);
			parameters.addValue("flagStatus", flagStatus);
		    parameters.addValue("status",status);
		    return jdbcTemplate.query(sqlQuery,parameters,new ProductApprovalMapper());
		    
	}

	@Override
	public int[] updateRequest(List<Long> productRequestId, RequestStatus status, Long managerId) {
	    String sqlQuery = "UPDATE product_requests SET Status = :status, ApprovedBy = :approvedBy, UpdatedAtDate = :updatedAtDate WHERE ProductRequestId = :productRequestId";
	    
	    List<MapSqlParameterSource> parameterSources = productRequestId.stream()
	            .map(id -> new MapSqlParameterSource()
	                    .addValue("status", status.getCode())
	                    .addValue("approvedBy", managerId)
	                    .addValue("updatedAtDate", LocalDateTime.now())
	                    .addValue("productRequestId", id))
	            .collect(Collectors.toList());

	    int[] records = jdbcTemplate.batchUpdate(sqlQuery, parameterSources.toArray(new MapSqlParameterSource[0]));

	    if (records.length == 0 || records[0] == 0) {
	        throw new RuntimeException("No request found with ID " + productRequestId + " to update status.");
	    }
	    return records;
	}


}
